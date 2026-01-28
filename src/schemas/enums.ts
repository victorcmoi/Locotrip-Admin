import { z } from 'zod';

// User Role Enum
export const UserRoleEnum = z.enum(['admin', 'guide', 'client']);
export type UserRole = z.infer<typeof UserRoleEnum>;

// Guide Status Enum
export const GuideStatusEnum = z.enum(['local', 'pro']);
export type GuideStatus = z.infer<typeof GuideStatusEnum>;

// Verification Status Enum
export const VerificationStatusEnum = z.enum(['pending', 'verified', 'rejected']);
export type VerificationStatus = z.infer<typeof VerificationStatusEnum>;

// Boost Status Enum
export const BoostStatusEnum = z.enum(['active', 'expired']);
export type BoostStatus = z.infer<typeof BoostStatusEnum>;

// Availability Status Enum
export const AvailabilityStatusEnum = z.enum(['available', 'unavailable', 'blocked']);
export type AvailabilityStatus = z.infer<typeof AvailabilityStatusEnum>;

// Document Type Enum
export const DocumentTypeEnum = z.enum(['CV', 'diploma', 'proof_of_residence']);
export type DocumentType = z.infer<typeof DocumentTypeEnum>;

// Media Type Enum
export const MediaTypeEnum = z.enum(['photo', 'video', 'document', 'audio']);
export type MediaType = z.infer<typeof MediaTypeEnum>;

// Payment Status Enum
export const PaymentStatusEnum = z.enum(['pending', 'completed', 'refunded']);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

// Dispute Status Enum
export const DisputeStatusEnum = z.enum(['open', 'pending', 'resolved', 'rejected']);
export type DisputeStatus = z.infer<typeof DisputeStatusEnum>;

// Subscription Type Enum
export const SubscriptionTypeEnum = z.enum(['loco_plus', 'standard']);
export type SubscriptionType = z.infer<typeof SubscriptionTypeEnum>;

// Support Ticket Status Enum
export const SupportTicketStatusEnum = z.enum(['open', 'in_progress', 'closed']);
export type SupportTicketStatus = z.infer<typeof SupportTicketStatusEnum>;

// Notification Type Enum
export const NotificationTypeEnum = z.enum(['booking_reminder', 'new_message']);
export type NotificationType = z.infer<typeof NotificationTypeEnum>;

// Export enum values for easier access (backward compatibility)
export const GuideStatusValues = {
  LOCAL: 'local' as const,
  PRO: 'pro' as const,
};

export const VerificationStatusValues = {
  PENDING: 'pending' as const,
  VERIFIED: 'verified' as const,
  REJECTED: 'rejected' as const,
};

export const DocumentTypeValues = {
  CV: 'CV' as const,
  DIPLOMA: 'diploma' as const,
  PROOF_OF_RESIDENCE: 'proof_of_residence' as const,
};

export const AvailabilityStatusValues = {
  AVAILABLE: 'available' as const,
  UNAVAILABLE: 'unavailable' as const,
  BLOCKED: 'blocked' as const,
};

export const DisputeStatusValues = {
  OPEN: 'open' as const,
  PENDING: 'pending' as const,
  RESOLVED: 'resolved' as const,
  REJECTED: 'rejected' as const,
};

export const SupportTicketStatusValues = {
  OPEN: 'open' as const,
  IN_PROGRESS: 'in_progress' as const,
  CLOSED: 'closed' as const,
};

export const UserRoleValues = {
  ADMIN: 'admin' as const,
  GUIDE: 'guide' as const,
  CLIENT: 'client' as const,
};

