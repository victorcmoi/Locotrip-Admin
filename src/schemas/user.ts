import { z } from 'zod';

export enum UserRole {
  ADMIN = 'admin',
  GUIDE = 'guide',
  CLIENT = 'client',
}

export const createUserSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  firstName: z.string({ invalid_type_error: 'Merci d\'entrer le prénom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
  lastName: z.string({ invalid_type_error: 'Merci d\'entrer le nom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
})

export const updateUserSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(UserRole),
  firstName: z.string({ invalid_type_error: 'Merci d\'entrer le prénom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
  lastName: z.string({ invalid_type_error: 'Merci d\'entrer le nom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
})

const userApiSuccessResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.nativeEnum(UserRole),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
  guides: z.array(z.any()).optional(),
  bookings: z.array(z.any()).optional(),
  reviews: z.array(z.any()).optional(),
  subscriptions: z.array(z.any()).optional(),
}).passthrough();

export const userApiResponseSchema = userApiSuccessResponseSchema;
export const usersApiResponseSchema = z.object({
  data: z.array(userApiSuccessResponseSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).passthrough(),
}).passthrough();

export type UserApiResponseSchema = z.infer<typeof userApiResponseSchema>;
export type UsersApiResponseSchema = z.infer<typeof usersApiResponseSchema>;

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
