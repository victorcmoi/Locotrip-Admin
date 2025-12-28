import { useQuery } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { usersApiResponseSchema, UsersApiResponseSchema, UserRole } from '@/schemas/user';

export interface GetUsersParams {
  role?: UserRole;
  search?: string;
  page?: number;
  limit?: number;
}

export const getUsers = async (params?: GetUsersParams) => {
  const queryParams = new URLSearchParams();

  if (params?.role) queryParams.append('role', params.role);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `users?${queryString}` : 'users';

  return new ApiRequest<UsersApiResponseSchema>(usersApiResponseSchema).get(endpoint);
};

export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
  });
};
