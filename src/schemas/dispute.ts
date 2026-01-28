import { z } from "zod";
import { userApiResponseSchema } from "./user";
import { bookingSchema } from "./booking";
import { DisputeStatusEnum, DisputeStatusValues } from "./enums";

// Re-export enum values for backward compatibility
export const DisputeStatus = DisputeStatusValues;
export type { DisputeStatus as DisputeStatusType } from "./enums";

// Labels for dispute status (French)
export const disputeStatusLabels: Record<string, string> = {
  [DisputeStatusValues.OPEN]: "Ouvert",
  [DisputeStatusValues.PENDING]: "En attente",
  [DisputeStatusValues.RESOLVED]: "Résolu",
  [DisputeStatusValues.REJECTED]: "Rejeté",
};

// Main dispute schema
export const disputeSchema = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  user_id: z.string().uuid(),
  reason: z.string(),
  status: DisputeStatusEnum,
  admin_id: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime().optional(),
  resolution_date: z.string().datetime().optional().nullable(),
  booking: bookingSchema.optional().nullable(),
  user: userApiResponseSchema.optional().nullable(),
  admin: userApiResponseSchema.optional().nullable(),
});

export type DisputeSchema = z.infer<typeof disputeSchema>;

// Array of disputes
export const disputesSchema = z.array(disputeSchema);
export type DisputesSchema = z.infer<typeof disputesSchema>;

// Update dispute DTO schema
export const updateDisputeSchema = z.object({
  status: DisputeStatusEnum.optional(),
  admin_id: z.string().uuid().optional(),
});

export type UpdateDisputeInput = z.infer<typeof updateDisputeSchema>;

// Response schema for updating a dispute
export const updateDisputeResponseSchema = z.object({
  message: z.string().optional(),
}).passthrough();

export type UpdateDisputeResponse = z.infer<typeof updateDisputeResponseSchema>;
