import { useQuery } from "@tanstack/react-query";
import { ApiRequest } from "../instance";
import { disputesSchema, DisputesSchema } from "@/schemas/dispute";

const getDisputes = async (): Promise<DisputesSchema> => {
  return new ApiRequest<DisputesSchema>(disputesSchema).get("disputes");
};

export function useDisputes() {
  const query = useQuery({
    queryKey: ["disputes"],
    queryFn: getDisputes,
  });

  return {
    ...query,
    mutate: query.refetch,
  };
}
