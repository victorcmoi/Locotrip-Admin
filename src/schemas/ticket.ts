import { z } from "zod";
import { userApiResponseSchema } from "./user";

export enum SupportTicketStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    CLOSED = "closed",
}

export const ticketMessageSchema = z.object({
    id: z.string().uuid(),
    ticket_id: z.string().uuid(),
    author_id: z.string().uuid(),
    content: z.string(),
    sent_at: z.string().datetime(),
});

export type TicketMessageSchema = z.infer<typeof ticketMessageSchema>;

export const supportTicketSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    subject: z.string(),
    status: z.nativeEnum(SupportTicketStatus),
    created_at: z.string().datetime(),
    closed_at: z.string().datetime().nullable(),
    user: userApiResponseSchema,
    messages: z.array(ticketMessageSchema),
});

export type SupportTicketSchema = z.infer<typeof supportTicketSchema>;

export const supportTicketsSchema = z.array(supportTicketSchema);

export type SupportTicketsSchema = z.infer<typeof supportTicketsSchema>;
