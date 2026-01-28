import { z } from "zod";
import { userApiResponseSchema } from "./user";
import { experienceSchema } from "./experience";

export enum DisputeStatus {
  OPEN = "open",
  PENDING = "pending",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

export const disputeStatusLabels: Record<DisputeStatus, string> = {
  [DisputeStatus.OPEN]: "Ouvert",
  [DisputeStatus.PENDING]: "En attente",
  [DisputeStatus.RESOLVED]: "Résolu",
  [DisputeStatus.REJECTED]: "Rejeté",
};

const bookingSchema = z.object({
  id: z.string().uuid(),
  experience: experienceSchema.optional().nullable(),
}).passthrough();

export const disputeSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  user_id: z.string().uuid(),
  reason: z.string(),
  status: z.nativeEnum(DisputeStatus),
  admin_id: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime().optional(),
  resolution_date: z.string().datetime().optional().nullable(),
  booking: bookingSchema.optional().nullable(),
  user: userApiResponseSchema.optional().nullable(),
  admin: userApiResponseSchema.optional().nullable(),
});

export type DisputeSchema = z.infer<typeof disputeSchema>;

export const disputesSchema = z.array(disputeSchema);

export type DisputesSchema = z.infer<typeof disputesSchema>;

export const updateDisputeSchema = z.object({
  status: z.nativeEnum(DisputeStatus).optional(),
  admin_id: z.string().uuid().optional(),
});

export type UpdateDisputeInput = z.infer<typeof updateDisputeSchema>;

export const updateDisputeResponseSchema = z.object({
  message: z.string().optional(),
}).passthrough();

export type UpdateDisputeResponse = z.infer<typeof updateDisputeResponseSchema>;

