import { z } from "zod";

export const addressSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    street: z.string(),
    city: z.string(),
    state: z.string().nullable().optional(),
    postal_code: z.string(),
    country: z.string(),
    longitude: z.number().nullable().optional(),
    latitude: z.number().nullable().optional(),
    created_at: z.string().or(z.date()).optional(),
    updated_at: z.string().or(z.date()).optional(),
}).passthrough();

export type AddressSchema = z.infer<typeof addressSchema>;
