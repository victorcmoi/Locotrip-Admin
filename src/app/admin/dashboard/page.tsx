import React from "react";
import DashboardContent from "@/components/Dashboard/DashboardContent";
import { getDashboardStats } from "@/services/statistics/getDashboardStats";
import { ApiError } from "@/services/instance";
import SessionExpiredTrigger from "@/components/Auth/SessionExpiredTrigger";

export default async function Page() {
  try {
    const stats = await getDashboardStats();

    return (
      <div className="space-y-12 pt-8">
        <div className="border-l-4 border-surfie-green-600 pl-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-sm text-gray-600 mt-2">Retrouvez toutes les informations sur la plateforme Locotrip</p>
        </div>
        <DashboardContent stats={stats} />
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return <SessionExpiredTrigger />;
    }
    throw error;
  }
}
