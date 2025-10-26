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
  id: z.string().cuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.nativeEnum(UserRole),
});

export const userApiResponseSchema = userApiSuccessResponseSchema;
export const usersApiResponseSchema = z.array(userApiSuccessResponseSchema);

export type UserApiResponseSchema = z.infer<typeof userApiResponseSchema>;
export type UsersApiResponseSchema = z.infer<typeof usersApiResponseSchema>;

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
