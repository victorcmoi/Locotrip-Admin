import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { guidesSchema, GuidesSchema } from '@/schemas/guide';

export const getUsers = async () => {
  return new ApiRequest<GuidesSchema>(guidesSchema).get('guides');
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['guides'],
    queryFn: () => getUsers(),
  });
};
