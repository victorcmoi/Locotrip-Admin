"use client";

import React, { useState } from "react";
import Modal from "@/components/Globals/Modal";
import { EyeIcon, CalendarIcon, UserIcon, MapPinIcon, CurrencyEuroIcon, UsersIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import Link from "next/link";
import AdminRoutes from "@/utils/routes";

dayjs.locale("fr");

interface BookingDetailsModalProps {
  booking: any;
  experience?: {
    id: string;
    title: string;
    city?: {
      name: string;
      country?: string;
    };
    price?: number;
    duration?: number;
  };
  showGuide?: boolean; // If true, show guide info (for client bookings). If false, show client info (for guide bookings)
  trigger?: React.ReactNode;
  showBoth?: boolean; // If true, show both client and guide info
}

const BookingStatusLabel: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmé", className: "bg-green-100 text-green-800" },
  completed: { label: "Terminé", className: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Annulé", className: "bg-red-100 text-red-800" },
};

export default function BookingDetailsModal({
  booking,
  experience,
  showGuide = false,
  trigger,
  showBoth = false,
}: BookingDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Non renseigné";
    return dayjs(dateString).format("D MMMM YYYY à HH:mm");
  };

  const formatShortDate = (dateString?: string | null) => {
    if (!dateString) return "Non renseigné";
    return dayjs(dateString).format("D MMMM YYYY");
  };

  const status = BookingStatusLabel[booking.status || "pending"] || BookingStatusLabel.pending;

  // Get experience from booking or from props
  const exp = booking.experience || experience;
  const guide = booking.experience?.guide || exp?.guide;
  const guideUser = guide?.user;
  const client = booking.user;

  return (
    <>
      {trigger ? (
        <div onClick={openModal} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={openModal}
          className="inline-flex items-center p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer aspect-square"
          title="Voir les détails"
        >
          <EyeIcon className="h-5 w-5" />
        </button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Détails de la réservation"
        size="large"
      >
        <div className="space-y-6">
          {/* Statut et dates */}
          <section>
            <h3 className="text-sm font-bold text-surfie-green-800 uppercase tracking-wider mb-3">
              Informations générales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block pb-1">Statut</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${status.className}`}>
                  {status.label}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Date de réservation</span>
                <span className="text-sm font-medium text-gray-900 mt-1 block">
                  {formatDate(booking.created_at)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Date de l&apos;expérience</span>
                <div className="flex items-center gap-1 mt-1">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {formatShortDate(booking.booking_date)}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">ID de la réservation</span>
                <span className="text-xs font-mono text-gray-600 mt-1 block break-all">
                  {booking.id}
                </span>
              </div>
            </div>
          </section>

          {/* Détails financiers */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Détails financiers
            </h3>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <UsersIcon className="h-4 w-4" />
                  <span className="text-xs">Participants</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {booking.number_of_participants || 1}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <CurrencyEuroIcon className="h-4 w-4" />
                  <span className="text-xs">Prix unitaire</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {exp?.price || "-"} €
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <CurrencyEuroIcon className="h-4 w-4" />
                  <span className="text-xs">Total</span>
                </div>
                <span className="text-lg font-bold text-surfie-green-700">
                  {booking.total_price || "-"} €
                </span>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            {/* Client */}
            {client && (!showGuide || showBoth) && (
              <Link href={`/admin/users/${client.id}`} className="block cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Client
                </h3>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-xs text-gray-600">{client.email}</p>
                  {client.phone && (
                    <p className="text-xs text-gray-600 mt-1">{client.phone}</p>
                  )}
                </div>
              </Link>
            )}

            {/* Guide */}
            {guideUser && (showGuide || showBoth) && (
              <Link href={`/admin/users/${guideUser.id}`} className="block cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                  <UserIcon className="h-4 w-4 inline mr-1" />
                  Guide
                </h3>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {guideUser.first_name} {guideUser.last_name}
                  </p>
                  <p className="text-xs text-gray-600">{guideUser.email}</p>
                  {guideUser.phone && (
                    <p className="text-xs text-gray-600 mt-1">{guideUser.phone}</p>
                  )}
                </div>
              </Link>
            )}

            {/* Expérience */}
            {exp && (
              <Link href={AdminRoutes.experienceDetail(exp.id)} className="block cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Expérience
                </h3>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {exp.title}
                  </p>
                  {exp.city && (
                    <p className="text-xs text-gray-600">
                      {exp.city.name}{exp.city.country ? `, ${exp.city.country}` : ""}
                    </p>
                  )}
                  {exp.duration && (
                    <p className="text-xs text-gray-600 mt-1">
                      Durée : {exp.duration} min
                    </p>
                  )}
                </div>
              </Link>
            )}
          </section>

          {/* Notes spéciales */}
          {booking.special_requests && (
            <section>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                Demandes spéciales
              </h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {booking.special_requests}
              </p>
            </section>
          )}
        </div>
      </Modal>
    </>
  );
}
