"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Globals/Modal";
import {
  GuideDocumentSchema,
  VerificationStatus,
  DocumentType,
} from "@/schemas/guide";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import DocumentStatusBadge from "./DocumentStatusBadge";
import { useUpdateGuideDocument } from "@/services/guides/updateGuideDocument";
import { toast } from "sonner";

dayjs.locale("fr");

interface DocumentDetailsModalProps {
  document: GuideDocumentSchema;
  guideId: string;
  onStatusUpdated?: () => void;
}

const getDocumentTypeName = (
  type: (typeof DocumentType)[keyof typeof DocumentType] | string,
): string => {
  switch (type) {
    case DocumentType.CV:
    case "CV":
      return "Curriculum Vitae";
    case DocumentType.DIPLOMA:
    case "diploma":
      return "Diplôme";
    case DocumentType.PROOF_OF_RESIDENCE:
    case "proof_of_residence":
      return "Justificatif de domicile";
    case DocumentType.GUIDE_CARD:
    case "guide_card":
      return "Carte professionnelle";
    case DocumentType.OTHER:
    case "other":
      return "Autre";
    default:
      return type;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case VerificationStatus.VERIFIED:
      return { icon: CheckCircleIcon, color: "text-green-500" };
    case VerificationStatus.REJECTED:
      return { icon: XCircleIcon, color: "text-red-500" };
    default:
      return { icon: ClockIcon, color: "text-yellow-500" };
  }
};

export default function DocumentDetailsModal({
  document,
  guideId,
  onStatusUpdated,
}: DocumentDetailsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState(document.verification_comment || "");
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateDocument, isPending } = useUpdateGuideDocument();

  // Sync local document state when prop changes (after query refetch)
  useEffect(() => {
    if (!isEditing) {
      setComment(document.verification_comment || "");
    }
  }, [document, isEditing]);

  const openModal = () => {
    setComment(document.verification_comment || "");
    setIsEditing(false);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const formatDate = (dateString?: string | Date | null) => {
    if (!dateString) return "Non renseigné";
    return dayjs(dateString).format("D MMMM YYYY à HH:mm");
  };

  const handleSaveComment = () => {
    updateDocument(
      {
        guideId,
        documentId: document.id,
        data: { verification_comment: comment || null },
      },
      {
        onSuccess: () => {
          toast.success("Commentaire enregistré");
          setIsEditing(false);
          onStatusUpdated?.();
        },
        onError: (error) => {
          console.error("Erreur lors de la sauvegarde du commentaire:", error);
          toast.error("Erreur lors de la sauvegarde du commentaire");
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setComment(document.verification_comment || "");
    setIsEditing(false);
  };

  const StatusIconData = getStatusIcon(document.verification_status);

  return (
    <>
      <button
        onClick={openModal}
        className="flex w-fit items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors cursor-pointer text-sm text-left"
        title="Voir les détails du document"
      >
        <span>{getDocumentTypeName(document.document_type)}</span>
        <StatusIconData.icon
          className={`h-4 w-4 ml-1 ${StatusIconData.color}`}
        />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Détails du document"
        size="medium"
      >
        <div className="space-y-6">
          {/* Type de document et statut */}
          <section>
            <h3 className="text-sm font-bold text-surfie-green-800 uppercase tracking-wider mb-3">
              Informations générales
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block pb-1">
                  Type de document
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {getDocumentTypeName(document.document_type)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block pb-1">
                  Statut de vérification
                </span>
                <DocumentStatusBadge
                  guideId={guideId}
                  documentId={document.id}
                  currentStatus={
                    document.verification_status as (typeof VerificationStatus)[keyof typeof VerificationStatus]
                  }
                  onStatusUpdated={onStatusUpdated}
                />
              </div>
            </div>
          </section>

          {/* Lien vers le document */}
          {document.document_url && (
            <section>
              <h3 className="text-sm font-bold text-surfie-green-800 uppercase tracking-wider mb-3">
                Fichier
              </h3>
              <a
                href={document.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surfie-green-50 border border-surfie-green-200 text-surfie-green-700 hover:bg-surfie-green-100 transition-colors font-medium text-sm"
              >
                Ouvrir le document ↗
              </a>
            </section>
          )}

          {/* Dates */}
          <section>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Dates
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 block">
                  Date d&apos;upload
                </span>
                <span className="text-sm font-medium text-gray-900 mt-1 block">
                  {formatDate(document.upload_date)}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">
                  Date de vérification
                </span>
                <span className="text-sm font-medium text-gray-900 mt-1 block">
                  {formatDate(document.verification_date)}
                </span>
              </div>
            </div>
          </section>

          {/* Commentaire de vérification - Éditable */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Commentaire de vérification
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-surfie-green-600 hover:text-surfie-green-700 font-medium"
                >
                  {document.verification_comment ? "Modifier" : "Ajouter"}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire de vérification..."
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-surfie-green-500 focus:border-surfie-green-500"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={isPending}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveComment}
                    disabled={isPending}
                    className="px-4 py-1.5 bg-surfie-green-600 text-white text-sm font-medium rounded-lg hover:bg-surfie-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Enregistrement..." : "Enregistrer"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {document.verification_comment ? (
                  <p className="text-sm text-gray-800 bg-gray-50 p-4 rounded-lg">
                    {document.verification_comment}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Aucun commentaire
                  </p>
                )}
              </>
            )}
          </section>

          {/* ID du document */}
          <section className="pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 block">ID du document</span>
            <span className="text-xs font-mono text-gray-500 break-all">
              {document.id}
            </span>
          </section>
        </div>
      </Modal>
    </>
  );
}
