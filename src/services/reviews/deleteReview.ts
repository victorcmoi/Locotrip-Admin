import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiRequest } from '@/services/instance';
import { z } from 'zod';

// Schema for 204 No Content response
const deleteReviewResponseSchema = z.void().or(z.undefined()).or(z.null());

export const deleteReview = async (reviewId: string) => {
  return new ApiRequest<void>(deleteReviewResponseSchema).delete(`reviews/${reviewId}`);
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    },
  });
};
