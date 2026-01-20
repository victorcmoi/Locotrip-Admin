"use client";

import React from "react";
import { useLocalGuidesWithCardRequests } from "@/services/guides/getLocalGuidesWithCardRequests";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

export default function Page() {
  const { data: guides, isLoading, error } = useLocalGuidesWithCardRequests();

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircleIcon className="h-3 w-3" />
            Vérifié
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
            <ClockIcon className="h-3 w-3" />
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <XCircleIcon className="h-3 w-3" />
            Rejeté
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "CV":
        return "CV";
      case "diploma":
        return "Diplôme";
      case "proof_of_residence":
        return "Justificatif";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-12 pt-8">
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 border-surfie-green-600 pl-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Guides locaux
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Gérez les demandes de carte professionnelle des guides locaux
          </p>
        </div>
      </div>

      <div className="rounded-lg border-2 border-gray-200 bg-white shadow-md">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-surfie-green-200 border-t-surfie-green-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Chargement des guides...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 font-semibold">
              Une erreur est survenue lors du chargement des guides.
            </p>
          </div>
        ) : !guides || guides.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 font-medium">
              Aucun guide local trouvé.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-surfie-green-700 to-surfie-green-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Guide</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Pays</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Expérience</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Langues</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Demande carte</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Documents</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {guides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900">
                        {String(guide.user?.first_name || "")} {String(guide.user?.last_name || "")}
                      </span>
                      <span className="text-xs text-gray-500">{String(guide.user?.email || "")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {guide.country || "Non renseigné"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {guide.years_of_experience ? `${guide.years_of_experience} ans` : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {guide.languages || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {guide.card_request_date
                      ? dayjs(guide.card_request_date).format("D MMMM YYYY")
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {!guide.documents || guide.documents.length === 0 ? (
                      <span className="text-gray-500 italic">Aucun</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {guide.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{getDocumentTypeName(doc.document_type)}</span>
                            {getVerificationStatusBadge(doc.verification_status)}
                          </div> 
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {guides && guides.length > 0 && (
        <div className="text-sm">
          Affichage de <strong className="font-bold">{guides.length}</strong> guide{guides.length > 1 ? 's' : ''} {guides.length > 1 ? 'locaux' : 'local'}
        </div>
      )}
    </div>
  );
}
