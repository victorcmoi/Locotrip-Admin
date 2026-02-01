import { z } from 'zod';

// User schema for nested user data in reviews
export const reviewUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
}).passthrough();

// Review schema
export const reviewSchema = z.object({
  id: z.string().uuid(),
  experience_id: z.string().uuid(),
  user_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  review_date: z.string().or(z.date()).optional(),
  user: reviewUserSchema.optional().nullable(),
}).passthrough();

// Array of reviews response
export const reviewsApiResponseSchema = z.array(reviewSchema);

// Delete response schema (for 204 No Content, we accept empty or undefined)
export const deleteReviewResponseSchema = z.object({}).passthrough().or(z.undefined()).or(z.null());

// Export TypeScript types
export type ReviewSchema = z.infer<typeof reviewSchema>;
export type ReviewsApiResponseSchema = z.infer<typeof reviewsApiResponseSchema>;
export type ReviewUserSchema = z.infer<typeof reviewUserSchema>;
