"use client";

import React, { useState, useEffect } from "react";
import { useTickets } from "@/services/tickets/getTickets";
import { SupportTicketStatus } from "@/schemas/ticket";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export default function Page() {
  const [statusFilter, setStatusFilter] = useState<SupportTicketStatus | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: tickets, isLoading, error } = useTickets();

  const filteredTickets = tickets?.filter((ticket) => {
    const matchesSearch =
      debouncedSearch === "" ||
      ticket.subject.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      `${ticket.user.first_name} ${ticket.user.last_name}`.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesStatus = statusFilter === "" || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusBadgeClass = (status: SupportTicketStatus) => {
    switch (status) {
      case SupportTicketStatus.OPEN:
        return "bg-red-500 text-white";
      case SupportTicketStatus.IN_PROGRESS:
        return "bg-lightning-yellow-300 text-white";
      case SupportTicketStatus.CLOSED:
        return "bg-surfie-green-600 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusLabel = (status: SupportTicketStatus) => {
    switch (status) {
      case SupportTicketStatus.OPEN:
        return "Ouvert";
      case SupportTicketStatus.IN_PROGRESS:
        return "En cours";
      case SupportTicketStatus.CLOSED:
        return "Fermé";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-12 pt-8">
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 border-surfie-green-600 pl-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Tickets
          </h1>
          <p className="text-sm text-gray-600 mt-2">Gérez les tickets de la plateforme Locotrip</p>
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
                placeholder="Rechercher par sujet, utilisateur ou email..."
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
              onChange={(e) => setStatusFilter(e.target.value as SupportTicketStatus | "")}
              className="block w-full rounded-lg border-2 border-gray-200 py-2.5 px-3 text-gray-900 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all"
            >
              <option value="">Tous les statuts</option>
              <option value={SupportTicketStatus.OPEN}>Ouvert</option>
              <option value={SupportTicketStatus.IN_PROGRESS}>En cours</option>
              <option value={SupportTicketStatus.CLOSED}>Fermé</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-md">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-surfie-green-200 border-t-surfie-green-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Chargement des tickets...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 font-semibold">Une erreur est survenue lors du chargement des tickets.</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 font-medium">Aucun ticket trouvé.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-surfie-green-700 to-surfie-green-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Sujet</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Messages</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Création</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Fermé le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{ticket.subject}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">
                    <Link href={`/admin/users/${ticket.user.id}`} className="flex flex-col px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                      <span className="font-medium">{ticket.user.first_name} {ticket.user.last_name}</span>
                      <span className="text-xs text-gray-500">{ticket.user.email}</span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getStatusBadgeClass(ticket.status)}`}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-surfie-green-100 text-surfie-green-700 font-bold">
                      {ticket.messages.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {ticket.created_at ? dayjs(ticket.created_at).format("D MMMM YYYY") : "Non renseigné"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {ticket.closed_at ? dayjs(ticket.closed_at).format("D MMMM YYYY") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {tickets && filteredTickets.length > 0 && (
        <div className="text-sm">
          Affichage de <strong className="font-bold">{filteredTickets.length}</strong> ticket{filteredTickets.length > 1 ? 's' : ''} sur <strong className="font-bold">{tickets.length}</strong> au total
        </div>
      )}
    </div>
  );
}
