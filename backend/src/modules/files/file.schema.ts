import { z } from 'zod';

const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  // Video
  'video/mp4',
  'video/webm',
] as const;

export const createUploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().refine(
    (val) => (ALLOWED_MIME_TYPES as readonly string[]).includes(val.toLowerCase()),
    { message: 'Unsupported MIME type for academic file assets' }
  ),
  sizeBytes: z.number().int().positive().max(52428800), // 50MB max
  fileType: z
    .enum(['avatar', 'homework', 'notes', 'study_material', 'document', 'other'])
    .default('document'),
  metadata: z.record(z.unknown()).optional(),
});

export const listFilesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  fileType: z
    .enum(['avatar', 'homework', 'notes', 'study_material', 'document', 'other'])
    .optional(),
  status: z
    .enum(['uploaded', 'processing', 'completed', 'failed'])
    .optional(),
});

export type CreateUploadUrlInput = z.infer<typeof createUploadUrlSchema>;
export type ListFilesQueryInput = z.infer<typeof listFilesQuerySchema>;
