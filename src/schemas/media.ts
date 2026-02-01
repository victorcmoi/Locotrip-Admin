import { z } from 'zod';

export const MediaTypeEnum = z.enum(['profile_picture', 'pictures']);
export type MediaType = z.infer<typeof MediaTypeEnum>;

export const mediaSchema = z.object({
  id: z.string().uuid(),
  entity_type: z.string(),
  entity_id: z.string().uuid(),
  url: z.string(),
  media_type: MediaTypeEnum,
  description: z.string().nullable().optional(),
  upload_date: z.string().or(z.date()).optional(),
}).passthrough();

export type MediaSchema = z.infer<typeof mediaSchema>;
