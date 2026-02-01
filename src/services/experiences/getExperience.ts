import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { experienceSchema, ExperienceSchema } from '@/schemas/experience';

export const getExperience = async (experienceId: string) => {
  return new ApiRequest<ExperienceSchema>(experienceSchema).get(`experiences/admin/${experienceId}`);
};

export const useExperience = (experienceId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['experience', experienceId],
    queryFn: () => getExperience(experienceId),
    enabled: !!experienceId && enabled,
  });
};
