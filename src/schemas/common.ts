import { z } from 'zod';

// Generic API success response with optional message
export const apiSuccessResponseSchema = z.object({
  message: z.string().optional(),
}).passthrough();

export type ApiSuccessResponse = z.infer<typeof apiSuccessResponseSchema>;

// Pagination metadata schema for paginated API responses
export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
}).passthrough();

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

// Generic paginated response wrapper
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    meta: paginationMetaSchema,
  }).passthrough();
