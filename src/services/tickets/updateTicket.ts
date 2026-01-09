import { useMutation } from "@tanstack/react-query";
import { ApiRequest } from "../instance";
import { SupportTicketStatus, updateTicketResponseSchema, UpdateTicketResponse } from "@/schemas/ticket";

export interface UpdateTicketDto {
  status?: SupportTicketStatus;
}

const updateTicket = async (id: string, data: UpdateTicketDto): Promise<UpdateTicketResponse> => {
  return new ApiRequest<UpdateTicketResponse>(updateTicketResponseSchema).put(`support-tickets/${id}`, data);
};

export function useUpdateTicket() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketDto }) =>
      updateTicket(id, data),
  });
}
