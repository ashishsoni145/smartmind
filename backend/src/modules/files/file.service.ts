import { supabase } from '../../db/client';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../lib/errors';
import { CreateUploadUrlInput, ListFilesQueryInput } from './file.schema';

export interface FileAssetRecord {
  id: string;
  userId: string;
  bucket: string;
  storagePath: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  fileType: string;
  processingStatus: string;
  errorMessage?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export class FileService {
  private static readonly BUCKET = 'sharpmind_files';

  public static async createSignedUploadUrl(
    userId: string,
    input: CreateUploadUrlInput
  ): Promise<{ fileId: string; uploadUrl: string; token: string; storagePath: string }> {
    const cleanFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${userId}/${Date.now()}-${cleanFileName}`;

    const { data: uploadData, error: storageErr } = await supabase.storage
      .from(this.BUCKET)
      .createSignedUploadUrl(storagePath);

    if (storageErr || !uploadData) {
      throw new BadRequestError(`Failed to generate signed upload URL: ${storageErr?.message}`);
    }

    const { data: asset, error: dbErr } = await supabase
      .from('file_assets')
      .insert({
        user_id: userId,
        bucket: this.BUCKET,
        storage_path: storagePath,
        original_name: input.fileName,
        mime_type: input.mimeType,
        size_bytes: input.sizeBytes,
        file_type: input.fileType,
        processing_status: 'uploaded',
        metadata: input.metadata || {},
      })
      .select('*')
      .single();

    if (dbErr || !asset) {
      throw new BadRequestError(`Failed to record file asset in database: ${dbErr?.message}`);
    }

    return {
      fileId: asset.id,
      uploadUrl: uploadData.signedUrl,
      token: uploadData.token,
      storagePath,
    };
  }

  public static async createSignedDownloadUrl(
    userId: string,
    userRole: string,
    fileId: string,
    expiresIn = 3600
  ): Promise<{ downloadUrl: string; expiresInSeconds: number; file: FileAssetRecord }> {
    const file = await this.getFileById(userId, userRole, fileId);

    const { data, error } = await supabase.storage
      .from(file.bucket)
      .createSignedUrl(file.storagePath, expiresIn);

    if (error || !data) {
      throw new BadRequestError(`Failed to generate download URL: ${error?.message}`);
    }

    return {
      downloadUrl: data.signedUrl,
      expiresInSeconds: expiresIn,
      file,
    };
  }

  public static async getFileById(
    userId: string,
    userRole: string,
    fileId: string
  ): Promise<FileAssetRecord> {
    const { data: asset, error } = await supabase
      .from('file_assets')
      .select('*')
      .eq('id', fileId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(`Failed to fetch file asset: ${error.message}`);
    }
    if (!asset) {
      throw new NotFoundError('File not found');
    }

    // Permission check
    if (asset.user_id !== userId && userRole !== 'admin' && userRole !== 'teacher') {
      throw new ForbiddenError('You do not have permission to access this file');
    }

    return {
      id: asset.id,
      userId: asset.user_id,
      bucket: asset.bucket,
      storagePath: asset.storage_path,
      originalName: asset.original_name,
      mimeType: asset.mime_type,
      sizeBytes: Number(asset.size_bytes),
      fileType: asset.file_type,
      processingStatus: asset.processing_status,
      errorMessage: asset.error_message,
      metadata: asset.metadata || {},
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
    };
  }

  public static async listFiles(
    userId: string,
    query: ListFilesQueryInput
  ): Promise<{ files: FileAssetRecord[]; total: number }> {
    let q = supabase
      .from('file_assets')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (query.fileType) {
      q = q.eq('file_type', query.fileType);
    }
    if (query.status) {
      q = q.eq('processing_status', query.status);
    }

    const from = (query.page - 1) * query.limit;
    const to = from + query.limit - 1;

    const { data, count, error } = await q
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new BadRequestError(`Failed to list files: ${error.message}`);
    }

    const files: FileAssetRecord[] = (data || []).map((asset) => ({
      id: asset.id,
      userId: asset.user_id,
      bucket: asset.bucket,
      storagePath: asset.storage_path,
      originalName: asset.original_name,
      mimeType: asset.mime_type,
      sizeBytes: Number(asset.size_bytes),
      fileType: asset.file_type,
      processingStatus: asset.processing_status,
      errorMessage: asset.error_message,
      metadata: asset.metadata || {},
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
    }));

    return {
      files,
      total: count || 0,
    };
  }

  public static async deleteFile(
    userId: string,
    userRole: string,
    fileId: string
  ): Promise<void> {
    const file = await this.getFileById(userId, userRole, fileId);

    // Remove from storage bucket
    await supabase.storage.from(file.bucket).remove([file.storagePath]);

    // Delete DB record
    const { error } = await supabase.from('file_assets').delete().eq('id', fileId);
    if (error) {
      throw new BadRequestError(`Failed to delete file record: ${error.message}`);
    }
  }
}
