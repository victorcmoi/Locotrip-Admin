import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { usersApiResponseSchema, UsersApiResponseSchema } from '@/schemas/user';

export const getUsers = async () => {
  return new ApiRequest<UsersApiResponseSchema>(usersApiResponseSchema).get('users');
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
};
