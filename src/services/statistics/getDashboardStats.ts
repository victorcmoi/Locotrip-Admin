import { ApiRequest } from "../instance";
import { dashboardStatsSchema, type DashboardStats } from "@/schemas/statistics";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const api = new ApiRequest<DashboardStats>(dashboardStatsSchema);
  return api.get("statistics/dashboard");
};
