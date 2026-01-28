"use client";

import React, { useState } from "react";
import Modal from "@/components/Globals/Modal";
import { GuideSchema, GuideStatus, VerificationStatus, DocumentType } from "@/schemas/guide";
import { CheckBadgeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useUpdateGuide } from "@/services/guides/updateGuide";
import { toast } from "sonner";

interface ValidateGuideModalProps {
  guide: GuideSchema;
  onValidated?: () => void;
}

const getDocumentTypeName = (type: typeof DocumentType[keyof typeof DocumentType] | string): string => {
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
    default:
      return type;
  }
};

export default function ValidateGuideModal({
  guide,
  onValidated,
}: ValidateGuideModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateGuide, isPending } = useUpdateGuide();

  const documents = guide.documents || [];
  const unverifiedDocs = documents.filter(
    (doc) => doc.verification_status !== VerificationStatus.VERIFIED
  );
  const allDocsVerified = unverifiedDocs.length === 0 && documents.length > 0;
  const hasNoDocuments = documents.length === 0;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleValidate = () => {
    updateGuide(
      {
        guideId: guide.id,
        data: { guide_status: GuideStatus.PRO, pro_card: true },
      },
      {
        onSuccess: () => {
          toast.success("Profil validé avec succès !");
          closeModal();
          onValidated?.();
        },
        onError: (error) => {
          console.error("Erreur lors de la validation:", error);
          toast.error("Erreur lors de la validation du profil");
        },
      }
    );
  };

  return (
    <>
      <button
        onClick={openModal}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surfie-green-600 text-white hover:bg-surfie-green-700 transition-colors text-sm font-medium"
        title="Valider le profil du guide"
      >
        <CheckBadgeIcon className="h-4 w-4" />
        <span>Passer pro</span>
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Valider le profil du guide"
        size="medium"
      >
        <div className="space-y-6">
          {/* Informations du guide */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-900">
              {String(guide.user?.first_name || "")} {String(guide.user?.last_name || "")}
            </p>
            <p className="text-sm text-gray-500">{String(guide.user?.email || "")}</p>
          </div>

          {/* Avertissement si documents non vérifiés */}
          {!allDocsVerified && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">
                    {hasNoDocuments
                      ? "Aucun document n'a été soumis"
                      : "Certains documents ne sont pas validés"}
                  </p>
                  {!hasNoDocuments && (
                    <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                      {unverifiedDocs.map((doc) => (
                        <li key={doc.id}>
                          {getDocumentTypeName(doc.document_type)} -{" "}
                          <span className="font-medium">
                            {doc.verification_status === VerificationStatus.PENDING
                              ? "En attente"
                              : "Rejeté"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-sm text-amber-700">
                    Voulez-vous tout de même valider ce profil ?
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message si tous les documents sont validés */}
          {allDocsVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ Tous les documents ont été vérifiés
              </p>
              <p className="text-sm text-green-700 mt-1">
                Le profil peut être validé en toute confiance.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={closeModal}
              disabled={isPending}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              disabled={isPending}
              className="px-4 py-2 bg-surfie-green-600 text-white rounded-lg hover:bg-surfie-green-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Validation..." : "Valider le profil"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
