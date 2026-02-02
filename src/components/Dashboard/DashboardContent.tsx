"use client";

import React from "react";
import Link from "next/link";
import AdminRoutes from "@/utils/routes";
import { DashboardStats } from "@/schemas/statistics";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Ticket, 
  AlertTriangle 
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface DashboardContentProps {
  stats: DashboardStats;
}

export default function DashboardContent({ stats }: DashboardContentProps) {

  return (
    <div className="space-y-8 mt-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-gray-500 text-sm font-medium">Utilisateurs Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.users.total}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-gray-500 text-sm font-medium">Guides Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.guides.total}</p>
          </div>
          <div className="p-3 bg-surfie-green-50 rounded-lg group-hover:bg-surfie-green-100 transition-colors">
            <UserCheck className="w-6 h-6 text-surfie-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all duration-300">
          <div>
            <p className="text-gray-500 text-sm font-medium">Réservations Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bookings.total}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        <Link href={AdminRoutes.tickets()} className="block">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all duration-300 h-full">
            <div>
              <p className="text-gray-500 text-sm font-medium">Tickets Ouverts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tickets.open}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
              <Ticket className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Link>

        <Link href={AdminRoutes.disputes()} className="block lg:col-span-4 xl:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all duration-300 h-full">
            <div>
              <p className="text-gray-500 text-sm font-medium">Litiges en attente</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.disputes.pending}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Répartition des Utilisateurs
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.users.breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.users.breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Statut des Réservations
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.bookings.breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.bookings.breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Guides Breakdown */}
       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Statut des Guides
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.guides.breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.guides.breakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
}
