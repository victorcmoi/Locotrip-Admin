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

// Guide schema for nested guide data in experience
// Guide is a separate model that has a relation to user
export const guideUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable().optional(),
}).passthrough();

export const guideInExperienceSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  bio: z.string().nullable().optional(),
  languages: z.string().nullable().optional(),
  years_of_experience: z.number().nullable().optional(),
  guide_status: z.string().optional(),
  user: guideUserSchema.optional().nullable(),
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
  guide: guideInExperienceSchema.optional().nullable(),
}).passthrough();

// Array of experiences response
export const experiencesApiResponseSchema = z.array(experienceSchema);

// Export TypeScript types
export type ExperienceSchema = z.infer<typeof experienceSchema>;
export type ExperiencesApiResponseSchema = z.infer<typeof experiencesApiResponseSchema>;
export type CitySchema = z.infer<typeof citySchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
