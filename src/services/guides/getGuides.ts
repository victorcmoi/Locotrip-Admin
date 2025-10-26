import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { guidesSchema, GuidesSchema } from '@/schemas/guide';

export const getGuides = async () => {
  return new ApiRequest<GuidesSchema>(guidesSchema).get('guides');
};

export const useGuides = () => {
  return useQuery({
    queryKey: ['guides'],
    queryFn: () => getGuides(),
  });
};
