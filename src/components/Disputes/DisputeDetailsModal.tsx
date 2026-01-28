"use client";

import React, { useState } from "react";
import Modal from "@/components/Globals/Modal";
import { DisputeSchema } from "@/schemas/dispute";
import { EyeIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import Link from "next/link";
import DisputeStatusBadge from "./DisputeStatusBadge";

dayjs.locale("fr");

interface DisputeDetailsModalProps {
  dispute: DisputeSchema;
}

export default function DisputeDetailsModal({
  dispute,
}: DisputeDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Non renseigné";
    return dayjs(dateString).format("D MMMM YYYY à HH:mm");
  };

  const guide = dispute.booking?.experience?.guide;
  const guideUser = guide?.user;

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center p-2 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer aspect-square"
        title="Voir les détails"
      >
        <EyeIcon className="h-5 w-5" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Détails du litige"
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
                <DisputeStatusBadge disputeId={dispute.id} currentStatus={dispute.status} onStatusUpdated={() => {}} />
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Date de création</span>
                <span className="text-sm font-medium text-gray-900 mt-1 block">
                  {formatDate(dispute.created_at)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Date de résolution</span>
                <span className="text-sm font-medium text-gray-900 mt-1 block">
                  {formatDate(dispute.resolution_date)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">ID du litige</span>
                <span className="text-xs font-mono text-gray-600 mt-1 block break-all">
                  {dispute.id}
                </span>
              </div>
            </div>
          </section>

          {/* Motif */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Motif du litige
            </h3>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {dispute.reason}
            </p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            {/* Utilisateur plaignant */}
            <Link href={`/admin/users/${dispute?.user?.id}`} className="block cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                Utilisateur plaignant
              </h3>
              {dispute.user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {dispute.user.first_name} {dispute.user.last_name}
                    </p>
                    <p className="text-xs text-gray-600">{dispute.user.email}</p>
                    {dispute.user.phone && (
                      <p className="text-xs text-gray-600 mt-1">{dispute.user.phone}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Utilisateur non disponible</p>
              )}
            </Link>

            {/* Guide concerné */}
            <Link href={`/admin/users/${guideUser?.id}`} className="block cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                Guide concerné
              </h3>
              {guideUser ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {guideUser.first_name} {guideUser.last_name}
                    </p>
                    <p className="text-xs text-gray-600">{guideUser.email}</p>
                    {guideUser.phone && (
                      <p className="text-xs text-gray-600 mt-1">{guideUser.phone}</p>
                    )}
                    {guide?.languages && (
                      <p className="text-xs text-gray-600 mt-1">{guide.languages}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Guide non disponible</p>
              )}
            </Link>
          </section>


          {/* Expérience concernée */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Expérience concernée
            </h3>
            {dispute.booking?.experience ? (
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {dispute.booking.experience.title}
                </p>
                {dispute.booking.experience.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {dispute.booking.experience.description}
                  </p>
                )}
                <div className="flex gap-4 mt-2">
                  <span className="text-xs text-gray-600">
                    {dispute.booking.experience.price} €
                  </span>
                  <span className="text-xs text-gray-600">
                    {dispute.booking.experience.duration} min
                  </span>
                  {dispute.booking.experience.city && (
                    <span className="text-xs text-gray-600">
                      {dispute.booking.experience.city.name}, {dispute.booking.experience.city.country}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Expérience non disponible</p>
            )}
          </section>

          {/* Administrateur assigné */}
          {dispute.admin && (
            <section>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
                Administrateur
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {dispute.admin.first_name} {dispute.admin.last_name}
                  </p>
                  <p className="text-xs text-gray-600">{dispute.admin.email}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </Modal>
    </>
  );
}
