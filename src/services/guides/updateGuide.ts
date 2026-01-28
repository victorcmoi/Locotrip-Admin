import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRequest } from "@/services/instance";
import { 
  updateGuideResponseSchema, 
  UpdateGuideResponse,
} from "@/schemas/guide";
import { GuideStatus } from "@/schemas/enums";

export type UpdateGuideDto = {
  guide_status?: GuideStatus;
  pro_card?: boolean;
  internal_comment?: string;
};

async function updateGuide(guideId: string, data: UpdateGuideDto) {
  const api = new ApiRequest<UpdateGuideResponse>(updateGuideResponseSchema);
  return api.put(`guides/${guideId}`, data);
}

export function useUpdateGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guideId, data }: { guideId: string; data: UpdateGuideDto }) =>
      updateGuide(guideId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides", "local"] });
    },
  });
}
