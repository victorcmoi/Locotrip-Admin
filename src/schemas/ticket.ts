import { z } from "zod";
import { userApiResponseSchema } from "./user";
import { SupportTicketStatusEnum, SupportTicketStatusValues } from "./enums";

// Re-export enum values for backward compatibility
export const SupportTicketStatus = SupportTicketStatusValues;
export type { SupportTicketStatus as SupportTicketStatusType } from "./enums";

// Send ticket message DTO schema
export const sendTicketMessageSchema = z.object({
  ticket_id: z.string().uuid(),
  author_id: z.string().uuid(),
  content: z.string().min(1),
});

export type SendTicketMessageInput = z.infer<typeof sendTicketMessageSchema>;

// Update ticket DTO schema
export const updateTicketSchema = z.object({
  status: SupportTicketStatusEnum.optional(),
  closed_at: z.string().datetime().optional(),
});

export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

// Response schema for updating a ticket
export const updateTicketResponseSchema = z.object({
  message: z.string().optional(),
}).passthrough();

export type UpdateTicketResponse = z.infer<typeof updateTicketResponseSchema>;

// Ticket message schema
export const ticketMessageSchema = z.object({
  id: z.string().uuid(),
  ticket_id: z.string().uuid(),
  author_id: z.string().uuid(),
  content: z.string(),
  sent_at: z.string().datetime(),
});

export type TicketMessageSchema = z.infer<typeof ticketMessageSchema>;

// Support ticket schema
export const supportTicketSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  subject: z.string(),
  status: SupportTicketStatusEnum,
  created_at: z.string().datetime(),
  closed_at: z.string().datetime().nullable(),
  user: userApiResponseSchema,
  messages: z.array(ticketMessageSchema),
});

export type SupportTicketSchema = z.infer<typeof supportTicketSchema>;

// Array of support tickets
export const supportTicketsSchema = z.array(supportTicketSchema);
export type SupportTicketsSchema = z.infer<typeof supportTicketsSchema>;
