import { z } from 'zod';

// City schema for nested city data
export const citySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  country: z.string(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
}).passthrough();

// Review schema for nested reviews
export const reviewSchema = z.object({
  id: z.string().uuid(),
  experience_id: z.string().uuid(),
  user_id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().nullable().optional(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
}).passthrough();

// Main experience schema
export const experienceSchema = z.object({
  id: z.string().uuid(),
  guide_id: z.string().uuid(),
  city_id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  price: z.coerce.number(),
  duration: z.number(), // in minutes
  max_capacity: z.number().nullable().optional(),
  is_published: z.boolean().optional(),
  is_active: z.boolean().optional(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
  deleted_at: z.string().or(z.date()).nullable().optional(),
  city: citySchema.optional(),
  reviews: z.array(reviewSchema).optional(),
}).passthrough();

// Array of experiences response
export const experiencesApiResponseSchema = z.array(experienceSchema);

// Export TypeScript types
export type ExperienceSchema = z.infer<typeof experienceSchema>;
export type ExperiencesApiResponseSchema = z.infer<typeof experiencesApiResponseSchema>;
export type CitySchema = z.infer<typeof citySchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
