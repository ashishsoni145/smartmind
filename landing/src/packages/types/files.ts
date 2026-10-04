export type FileAssetType =
  | 'avatar'
  | 'homework'
  | 'notes'
  | 'study_material'
  | 'document'
  | 'other';

export type FileProcessingStatus = 'uploaded' | 'processing' | 'completed' | 'failed';

export interface FileAsset {
  id: string;
  userId: string;
  bucket: string;
  storagePath: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  fileType: FileAssetType;
  processingStatus: FileProcessingStatus;
  errorMessage?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UploadUrlResponse {
  fileId: string;
  uploadUrl: string;
  token: string;
  storagePath: string;
}

export interface DownloadUrlResponse {
  downloadUrl: string;
  expiresInSeconds: number;
  file: FileAsset;
}
