import { z } from 'zod';

export const createUploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
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
