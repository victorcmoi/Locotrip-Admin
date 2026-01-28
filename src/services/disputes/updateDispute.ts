import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRequest } from "../instance";
import { UpdateDisputeInput, updateDisputeResponseSchema, UpdateDisputeResponse } from "@/schemas/dispute";

const updateDispute = async (id: string, data: UpdateDisputeInput): Promise<UpdateDisputeResponse> => {
  return new ApiRequest<UpdateDisputeResponse>(updateDisputeResponseSchema).put(`disputes/${id}`, data);
};

export function useUpdateDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDisputeInput }) => updateDispute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
}
