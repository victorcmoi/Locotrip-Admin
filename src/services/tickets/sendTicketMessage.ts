import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiRequest } from "../instance";
import { z } from "zod";
import { ticketMessageSchema, sendTicketMessageSchema, SendTicketMessageInput } from "@/schemas/ticket";


export async function sendTicketMessage( data: SendTicketMessageInput ): Promise<z.infer<typeof ticketMessageSchema>> {
  const apiRequest = new ApiRequest<z.infer<typeof ticketMessageSchema>>(ticketMessageSchema);
  return apiRequest.post(`support-tickets/${data.ticket_id}/messages`, data);
}

export const useSendTicketMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendTicketMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};