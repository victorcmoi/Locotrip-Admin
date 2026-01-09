import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { experiencesApiResponseSchema, ExperiencesApiResponseSchema } from '@/schemas/experience';

export const getGuideExperiences = async (guideId: string) => {
  return new ApiRequest<ExperiencesApiResponseSchema>(experiencesApiResponseSchema).get(`experiences/guide/${guideId}`);
};

export const useGuideExperiences = (guideId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['experiences', 'guide', guideId],
    queryFn: () => getGuideExperiences(guideId),
    enabled: !!guideId && enabled,
  });
};
