import { z } from "zod";

export const dashboardStatsItemSchema = z.object({
  name: z.string(),
  value: z.number(),
});

export const dashboardStatsSchema = z.object({
  users: z.object({
    total: z.number(),
    breakdown: z.array(dashboardStatsItemSchema),
  }),
  guides: z.object({
    total: z.number(),
    breakdown: z.array(dashboardStatsItemSchema),
  }),
  bookings: z.object({
    total: z.number(),
    breakdown: z.array(dashboardStatsItemSchema),
  }),
  tickets: z.object({
    open: z.number(),
  }),
  disputes: z.object({
    pending: z.number(),
  }),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
