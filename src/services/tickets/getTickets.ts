import { useQuery } from "@tanstack/react-query";
import { ApiRequest } from "../instance";
import { supportTicketsSchema, SupportTicketsSchema } from "@/schemas/ticket";

const getTickets = async (): Promise<SupportTicketsSchema> => {
    return new ApiRequest<SupportTicketsSchema>(supportTicketsSchema).get("support-tickets");
};

export function useTickets() {
  const query = useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
  });

  return {
    ...query,
    mutate: query.refetch,
  };
};