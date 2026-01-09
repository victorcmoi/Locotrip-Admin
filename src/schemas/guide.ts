import { z } from 'zod';
import { experienceSchema } from './experience';

export enum GuideStatus {
  LOCAL = 'local',
  PRO = 'pro',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export enum DocumentType {
  CV = 'CV',
  DIPLOMA = 'diploma',
  PROOF_OF_RESIDENCE = 'proof_of_residence',
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  BLOCKED = 'blocked',
}

const guideDocumentSchema = z.object({
  id: z.string().uuid(),
  guide_id: z.string().uuid(),
  document_type: z.nativeEnum(DocumentType),
  verification_status: z.nativeEnum(VerificationStatus),
  verification_comment: z.string().nullable(),
  upload_date: z.string().or(z.date()),
  verification_date: z.string().or(z.date()).nullable(),
}).passthrough();

const guideAvailabilitySchema = z.object({
  id: z.string().uuid(),
  guide_id: z.string().uuid(),
  start_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()),
  status: z.nativeEnum(AvailabilityStatus),
}).passthrough();

export const guideSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  user: z
    .object({
      id: z.string(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      role: z.string().optional(),
    })
    .passthrough()
    .optional(),
  bio: z.string().nullish(),
  languages: z.string().nullish(),
  years_of_experience: z.number().nullish(),
  guide_status: z.string(),
  pro_card: z.boolean().nullish(),
  country: z.string().nullish(),
  card_request_date: z.string().or(z.date()).nullable().optional(),
  card_verification_date: z.string().or(z.date()).nullable().optional(),
  internal_comment: z.string().nullish(),
  is_active: z.boolean().optional(),
  suspended_at: z.string().or(z.date()).nullable().optional(),
  suspension_reason: z.string().nullable().optional(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
  documents: z.array(guideDocumentSchema).optional(),
  availabilities: z.array(guideAvailabilitySchema).optional(),
  experiences: z.array(experienceSchema).optional(),
}).passthrough();

export const guidesSchema = z.array(guideSchema);

export const guideApiResponseSchema = z.array(guideSchema);

export type GuideSchema = z.infer<typeof guideSchema>;
export type GuidesSchema = z.infer<typeof guidesSchema>;
export type GuideApiResponseSchema = z.infer<typeof guideApiResponseSchema>;
export type GuideDocumentSchema = z.infer<typeof guideDocumentSchema>;
export type GuideAvailabilitySchema = z.infer<typeof guideAvailabilitySchema>;
