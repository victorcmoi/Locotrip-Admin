"use client";

import React from "react";
import Modal from "@/components/Globals/Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmDeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isDeleting: boolean;
}

const ConfirmDeleteReviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isDeleting,
}: ConfirmDeleteReviewModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer l'avis" size="small">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Êtes-vous sûr de vouloir supprimer l&apos;avis de{" "}
              <strong className="font-bold text-gray-900">{userName}</strong> ?
              Cette action est irréversible.
            </p>
          </div>
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
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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

export default ConfirmDeleteReviewModal;
