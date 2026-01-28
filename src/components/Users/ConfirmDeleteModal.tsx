"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Globals/Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  userName: string;
  isDeleting: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isDeleting,
}: ConfirmDeleteModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setReason("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmer la suppression" size="small">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
              <strong className="font-bold text-gray-900">{userName}</strong> ?
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="delete-reason" className="block text-sm font-semibold text-gray-700 mb-2">
            Raison de la suppression (optionnel)
          </label>
          <textarea
            id="delete-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isDeleting}
            rows={3}
            className="block w-full rounded-lg border-2 border-gray-200 py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Ex: Demande RGPD de l'utilisateur, compte inactif depuis plus d'un an, etc."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isDeleting ? (
              <span className="flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                Suppression...
              </span>
            ) : (
              "Confirmer"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
