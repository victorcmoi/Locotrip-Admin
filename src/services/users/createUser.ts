import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { createUserSchema, CreateUserSchema, userApiResponseSchema, UserApiResponseSchema } from '@/schemas/user';

export const createUser = async (data: CreateUserSchema) => {
  const validatedData = createUserSchema.parse(data);

  const apiData = {
    email: validatedData.email,
    role: validatedData.role,
    first_name: validatedData.firstName,
    last_name: validatedData.lastName,
    password: validatedData.password,
  };

  return new ApiRequest<UserApiResponseSchema>(userApiResponseSchema).post('users', apiData);
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate users query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
