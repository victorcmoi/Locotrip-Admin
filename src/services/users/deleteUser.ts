import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { z } from 'zod';

const deleteUserResponseSchema = z.object({
  message: z.string().optional(),
}).passthrough();

type DeleteUserResponse = z.infer<typeof deleteUserResponseSchema>;

export const deleteUser = async (userId: string, reason?: string) => {
  const body = reason ? { reason } : undefined;
  return new ApiRequest<DeleteUserResponse>(deleteUserResponseSchema).delete(`users/${userId}/soft`, body);
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) => deleteUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
