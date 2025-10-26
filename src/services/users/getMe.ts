import { useQuery } from '@tanstack/react-query';

import { UserApiResponseSchema, userApiResponseSchema } from "@/schemas/user";
import { ApiRequest } from "@/services/instance";

export const getMe = async () => {
  return new ApiRequest<UserApiResponseSchema>(userApiResponseSchema).get('@me');
};

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => getMe(),
  });
};
