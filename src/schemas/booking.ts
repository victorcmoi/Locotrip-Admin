import { z } from 'zod';
import { experienceSchema } from './experience';

// Booking schema for nested booking data
export const bookingSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  experience_id: z.string().uuid().optional(),
  guide_id: z.string().uuid().optional(),
  booking_date: z.string().or(z.date()).optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  status: z.string().optional(),
  total_price: z.coerce.number().optional(),
  number_of_people: z.number().optional(),
  created_at: z.string().or(z.date()).optional(),
  updated_at: z.string().or(z.date()).optional(),
  experience: experienceSchema.optional().nullable(),
}).passthrough();

export type BookingSchema = z.infer<typeof bookingSchema>;

// Array of bookings
export const bookingsSchema = z.array(bookingSchema);

export type BookingsSchema = z.infer<typeof bookingsSchema>;
