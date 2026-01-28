import { z } from 'zod';
import { addressSchema } from './address';
import { guideSchema } from './guide';
import { paginationMetaSchema } from './common';
import { UserRoleEnum, UserRoleValues } from './enums';

// Re-export enum values for backward compatibility
export const UserRole = UserRoleValues;
export type { UserRole as UserRoleType } from './enums';

// Create user DTO schema
export const createUserSchema = z.object({
  email: z.string().email(),
  role: UserRoleEnum,
  firstName: z.string({ invalid_type_error: 'Merci d\'entrer le prénom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
  lastName: z.string({ invalid_type_error: 'Merci d\'entrer le nom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
  password: z.string({ invalid_type_error: 'Merci d\'entrer le mot de passe.', required_error: 'Ce champ est requis.' }).min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' }),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

// Update user DTO schema
export const updateUserSchema = z.object({
  email: z.string().email(),
  role: UserRoleEnum,
  firstName: z.string({ invalid_type_error: 'Merci d\'entrer le prénom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
  lastName: z.string({ invalid_type_error: 'Merci d\'entrer le nom.', required_error: 'Ce champ est requis.' }).min(1, { message: 'Ce champ est requis.' }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

// User API response schema (single user)
const userApiSuccessResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string().nullable().optional(),
  birth_date: z.string().or(z.date()).nullable().optional(),
  role: UserRoleEnum,
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
  address: addressSchema.nullable().optional(),
  guide: guideSchema.nullable().optional(),
  bookings: z.array(z.any()).optional(),
  reviews: z.array(z.any()).optional(),
  subscriptions: z.array(z.any()).optional(),
  marketing_consent: z.boolean().optional(),
  data_processing_consent: z.boolean().optional(),
}).passthrough();

export const userApiResponseSchema = userApiSuccessResponseSchema;
export type UserApiResponseSchema = z.infer<typeof userApiResponseSchema>;

// Users API response schema (paginated list)
export const usersApiResponseSchema = z.object({
  data: z.array(userApiSuccessResponseSchema),
  meta: paginationMetaSchema,
}).passthrough();

export type UsersApiResponseSchema = z.infer<typeof usersApiResponseSchema>;

// Delete user response schema
export const deleteUserResponseSchema = z.object({
  message: z.string().optional(),
}).passthrough();

export type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;
