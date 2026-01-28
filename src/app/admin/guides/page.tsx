"use client";

import React, { useState, useMemo } from "react";
import { useLocalGuidesWithCardRequests } from "@/services/guides/getLocalGuidesWithCardRequests";
import DocumentDetailsModal from "@/components/Guides/DocumentDetailsModal";
import ValidateGuideModal from "@/components/Guides/ValidateGuideModal";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import Link from "next/link";

dayjs.locale("fr");

export default function Page() {
  const { data: guides, isLoading, error } = useLocalGuidesWithCardRequests();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = useMemo(() => {
    if (!guides) return [];
    if (!searchQuery.trim()) return guides;

    const query = searchQuery.toLowerCase().trim();
    return guides.filter((guide) => {
      const fullName = `${guide.user?.first_name || ""} ${guide.user?.last_name || ""}`.toLowerCase();
      const email = String(guide.user?.email || "").toLowerCase();
      const country = String(guide.country || "").toLowerCase();
      const languages = String(guide.languages || "").toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        country.includes(query) ||
        languages.includes(query)
      );
    });
  }, [guides, searchQuery]);

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

      {/* Barre de recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
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
              placeholder="Rechercher par nom, email, pays ou langues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-lg border-2 border-gray-200 py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all"
            />
          </div>
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
        ) : filteredGuides.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 font-medium">
              {searchQuery ? "Aucun guide ne correspond à votre recherche." : "Aucun guide local trouvé."}
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
              {filteredGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/admin/users/${guide.user?.id}`} className="flex flex-col px-3 py-2 rounded-lg hover:bg-gray-100 transition-all">
                      <span className="font-semibold text-gray-900">
                        {String(guide.user?.first_name || "")} {String(guide.user?.last_name || "")}
                      </span>
                      <span className="text-xs text-gray-500">{String(guide.user?.email || "")}</span>
                    </Link>
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
                      <div className="flex flex-col gap-2">
                        {guide.documents.map((doc) => (
                          <DocumentDetailsModal key={doc.id} document={doc} guideId={guide.id} />
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <ValidateGuideModal guide={guide} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredGuides.length > 0 && (
        <div className="text-sm">
          Affichage de <strong className="font-bold">{filteredGuides.length}</strong> guide{filteredGuides.length > 1 ? 's' : ''} {filteredGuides.length > 1 ? 'locaux' : 'local'}
          {searchQuery && guides && filteredGuides.length !== guides.length && (
            <span className="text-gray-500"> sur {guides.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
