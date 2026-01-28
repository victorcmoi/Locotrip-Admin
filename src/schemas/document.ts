import { z } from 'zod';
import { DocumentTypeEnum, VerificationStatusEnum } from './enums';

// Guide document schema for document verification
export const guideDocumentSchema = z.object({
  id: z.string().uuid(),
  guide_id: z.string().uuid(),
  document_type: DocumentTypeEnum,
  document_url: z.string().url().optional(),
  verification_status: VerificationStatusEnum,
  verification_comment: z.string().nullable(),
  upload_date: z.string().or(z.date()),
  verification_date: z.string().or(z.date()).nullable(),
}).passthrough();

export type GuideDocumentSchema = z.infer<typeof guideDocumentSchema>;

// Array of guide documents
export const guideDocumentsSchema = z.array(guideDocumentSchema);

export type GuideDocumentsSchema = z.infer<typeof guideDocumentsSchema>;

// Update document DTO schema
export const updateGuideDocumentSchema = z.object({
  verification_status: VerificationStatusEnum.optional(),
  verification_comment: z.string().nullable().optional(),
});

export type UpdateGuideDocumentInput = z.infer<typeof updateGuideDocumentSchema>;

// Response schema for updating a document
export const updateDocumentResponseSchema = z.object({
  id: z.string(),
  guide_id: z.string(),
  document_type: z.string(),
  verification_status: z.string(),
  verification_comment: z.string().nullable(),
  upload_date: z.string().or(z.date()),
  verification_date: z.string().or(z.date()).nullable(),
}).passthrough();

export type UpdateDocumentResponse = z.infer<typeof updateDocumentResponseSchema>;
