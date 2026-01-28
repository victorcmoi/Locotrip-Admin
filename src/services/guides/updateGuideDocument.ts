"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRequest } from "@/services/instance";
import { 
  updateDocumentResponseSchema, 
  UpdateDocumentResponse,
} from "@/schemas/document";
import { VerificationStatus } from "@/schemas/enums";

export interface UpdateGuideDocumentDto {
  verification_status?: VerificationStatus;
  verification_comment?: string | null;
}

async function updateGuideDocument(
  guideId: string,
  documentId: string,
  data: UpdateGuideDocumentDto
) {
  const api = new ApiRequest<UpdateDocumentResponse>(updateDocumentResponseSchema);
  return api.patch(`guides/${guideId}/documents/${documentId}`, data);
}

export function useUpdateGuideDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guideId, documentId, data }: { guideId: string; documentId: string; data: UpdateGuideDocumentDto; }) => 
        updateGuideDocument(guideId, documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides", "local"] });
    },
  });
}
