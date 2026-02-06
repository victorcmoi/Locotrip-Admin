"use client";

import React, { useState, useEffect } from "react";
import { useDisputes } from "@/services/disputes/getDisputes";
import { DisputeStatus, disputeStatusLabels, DisputeSchema } from "@/schemas/dispute";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import Link from "next/link";
import DisputeStatusBadge from "@/components/Disputes/DisputeStatusBadge";
import DisputeDetailsModal from "@/components/Disputes/DisputeDetailsModal";

import BookingDetailsModal from "@/components/Bookings/BookingDetailsModal";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export default function Page() {
  const [statusFilter, setStatusFilter] = useState<typeof DisputeStatus[keyof typeof DisputeStatus] | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: disputes, isLoading, error, mutate } = useDisputes();

  const handleStatusUpdated = async () => {
    await mutate();
  };

  const filteredDisputes = disputes?.filter((dispute: DisputeSchema) => {
    const matchesSearch =
      debouncedSearch === "" ||
      dispute.reason.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (dispute.user?.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false) ||
      (`${dispute.user?.first_name ?? ''} ${dispute.user?.last_name ?? ''}`.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      (dispute.booking?.experience?.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === "" || dispute.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="space-y-12 pt-8">
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 border-surfie-green-600 pl-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Litiges
          </h1>
          <p className="text-sm text-gray-600 mt-2">Gérez les litiges de la plateforme Locotrip</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-semibold text-surfie-green-800 mb-2">
              Rechercher
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-surfie-green-500" aria-hidden="true" />
              </div>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border-2 border-gray-200 py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all"
                placeholder="Rechercher par motif, utilisateur, email ou expérience..."
              />
            </div>
          </div>

          <div className="sm:w-64">
            <label htmlFor="status" className="block text-sm font-semibold text-surfie-green-800 mb-2">
              Filtrer par statut
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof DisputeStatus[keyof typeof DisputeStatus] | "")}
              className="block w-full rounded-lg border-2 border-gray-200 py-2.5 px-3 text-gray-900 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all"
            >
              <option value="">Tous les statuts</option>
              <option value={DisputeStatus.OPEN}>{disputeStatusLabels[DisputeStatus.OPEN]}</option>
              <option value={DisputeStatus.PENDING}>{disputeStatusLabels[DisputeStatus.PENDING]}</option>
              <option value={DisputeStatus.RESOLVED}>{disputeStatusLabels[DisputeStatus.RESOLVED]}</option>
              <option value={DisputeStatus.REJECTED}>{disputeStatusLabels[DisputeStatus.REJECTED]}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border-2 border-gray-200 bg-white shadow-md">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-surfie-green-200 border-t-surfie-green-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Chargement des litiges...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 font-semibold">Une erreur est survenue lors du chargement des litiges.</p>
          </div>
        ) : filteredDisputes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 font-medium">Aucun litige trouvé.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-surfie-green-700 to-surfie-green-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Motif</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Guide</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Réservation</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Création</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredDisputes.map((dispute: DisputeSchema) => (
                <tr key={dispute.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 max-w-xs truncate" title={dispute.reason}>
                    {dispute.reason}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {dispute.user ? (
                      <Link href={`/admin/users/${dispute.user.id}`} className="flex flex-col px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                        <span className="font-medium">{dispute.user.first_name} {dispute.user.last_name}</span>
                        <span className="text-xs text-gray-500">{dispute.user.email}</span>
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    {dispute.booking?.experience?.guide?.user ? (
                      <Link href={`/admin/users/${dispute.booking?.experience?.guide?.user.id}`} className="flex flex-col px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                        <span className="font-medium">{dispute.booking?.experience?.guide?.user.first_name} {dispute.booking?.experience?.guide?.user.last_name}</span>
                        <span className="text-xs text-gray-500">{dispute.booking?.experience?.guide?.user.email}</span>
                      </Link>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {dispute.booking ? (
                      <BookingDetailsModal
                        booking={dispute.booking}
                        experience={dispute.booking.experience || undefined}
                        showBoth={true}
                        trigger={
                          <div className="block hover:bg-gray-50 transition-colors p-2 rounded-lg group text-left">
                            <p className="font-semibold text-gray-900">
                              Réservation #{dispute.booking.id.slice(0, 8)}...
                            </p>
                            {dispute.booking.experience && (
                              <p className="text-gray-500 text-xs line-clamp-1">{dispute.booking.experience.title}</p>
                            )}
                          </div>
                        }
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <DisputeStatusBadge
                      disputeId={dispute.id}
                      currentStatus={dispute.status}
                      onStatusUpdated={handleStatusUpdated}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {dispute.created_at ? dayjs(dispute.created_at).format("D MMMM YYYY") : "Non renseigné"}
                  </td>
                  <td className="px-6 py-4">
                    <DisputeDetailsModal dispute={dispute} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {disputes && filteredDisputes.length > 0 && (
        <div className="text-sm">
          Affichage de <strong className="font-bold">{filteredDisputes.length}</strong> litige{filteredDisputes.length > 1 ? 's' : ''} sur <strong className="font-bold">{disputes.length}</strong> au total
        </div>
      )}
    </div>
  );
}
