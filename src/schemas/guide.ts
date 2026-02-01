import { z } from 'zod';
import { experienceSchema } from './experience';
import { guideDocumentSchema } from './document';
import { mediaSchema } from './media';
import { 
  GuideStatusEnum, 
  AvailabilityStatusEnum,
  GuideStatusValues,
  VerificationStatusValues,
  DocumentTypeValues,
  AvailabilityStatusValues,
} from './enums';

// Re-export enum values for backward compatibility
export const GuideStatus = GuideStatusValues;
export const VerificationStatus = VerificationStatusValues;
export const DocumentType = DocumentTypeValues;
export const AvailabilityStatus = AvailabilityStatusValues;

// Re-export types for backward compatibility
export type { GuideStatus as GuideStatusType } from './enums';
export type { VerificationStatus as VerificationStatusType } from './enums';
export type { DocumentType as DocumentTypeType } from './enums';
export type { AvailabilityStatus as AvailabilityStatusType } from './enums';

// Guide availability schema
export const guideAvailabilitySchema = z.object({
  id: z.string().uuid(),
  guide_id: z.string().uuid(),
  start_date: z.string().or(z.date()),
  end_date: z.string().or(z.date()),
  status: AvailabilityStatusEnum,
}).passthrough();

export type GuideAvailabilitySchema = z.infer<typeof guideAvailabilitySchema>;

// Main guide schema
export const guideSchema = z.object({
  id: z.string(),
  user_id: z.string().optional(),
  user: z
    .object({
      id: z.string(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
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
  medias: z.array(mediaSchema).optional(),
  availabilities: z.array(guideAvailabilitySchema).optional(),
  experiences: z.array(experienceSchema).optional(),
}).passthrough();

export type GuideSchema = z.infer<typeof guideSchema>;

// Array of guides
export const guidesSchema = z.array(guideSchema);
export type GuidesSchema = z.infer<typeof guidesSchema>;

// Guide API response (array)
export const guideApiResponseSchema = z.array(guideSchema);
export type GuideApiResponseSchema = z.infer<typeof guideApiResponseSchema>;

// Re-export document schema for backward compatibility
export { guideDocumentSchema, type GuideDocumentSchema } from './document';

// Update guide DTO schema
export const updateGuideSchema = z.object({
  guide_status: GuideStatusEnum.optional(),
  pro_card: z.boolean().optional(),
  internal_comment: z.string().optional(),
});

export type UpdateGuideInput = z.infer<typeof updateGuideSchema>;

// Response schema for updating a guide
export const updateGuideResponseSchema = z.object({
  id: z.string(),
  guide_status: z.string(),
}).passthrough();

export type UpdateGuideResponse = z.infer<typeof updateGuideResponseSchema>;
