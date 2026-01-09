"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useGetUser } from "@/services/users/getUser";
import { UserRole } from "@/schemas/user";
import AdminRoutes from "@/utils/routes";
import { GuideStatus, VerificationStatus } from "@/schemas/guide";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGuideExperiences } from "@/services/guides/getGuideExperiences";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const { data: user, isLoading: isLoadingUser, error: errorUser } = useGetUser(userId);
  const { data: experiences, isLoading: isLoadingExperiences, error: errorExperiences } = useGuideExperiences(user?.guide?.id as string);

  console.log(experiences);
  
  if (isLoadingUser || isLoadingExperiences) {
    return (
      <div className="space-y-12 pt-8">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-surfie-green-200 border-t-surfie-green-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (errorUser || !user) {
    return (
      <div className="space-y-12 pt-8">
        <div className="p-12 text-center">
          <p className="text-red-600 font-semibold">Utilisateur introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-8">
      <button
        onClick={() => router.push(AdminRoutes.users())}
        className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:border-surfie-green-600 transition-all"
      >
        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
      </button>
      <div className="border-l-4 border-surfie-green-600 pl-4 flex-1">
        <h1 className="text-5xl font-bold text-gray-900">
          {user.first_name} {user.last_name}
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          {user.email}
        </p>
      </div>

      <div>
        <span
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${user.role === UserRole.ADMIN
            ? "bg-lightning-yellow-300 text-white shadow-sm"
            : user.role === UserRole.GUIDE
              ? "bg-surfie-green-600 text-white shadow-sm"
              : "bg-gray-200 text-gray-700"
            }`}
        >
          {user.role}
        </span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold text-surfie-green-800 mb-1">Email</p>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-surfie-green-800 mb-1">Téléphone</p>
            <p className="text-gray-900">{user.phone || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-surfie-green-800 mb-1">Date de naissance</p>
            <p className="text-gray-900">{user.birth_date ? dayjs(user.birth_date).format("D MMMM YYYY") : "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-surfie-green-800 mb-1">Date d'inscription</p>
            <p className="text-gray-900">{user.created_at ? dayjs(user.created_at).format("D MMMM YYYY") : "Non renseigné"}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-surfie-green-800">Compte actif :</p>
            {user.is_active ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-surfie-green-800">Email vérifié :</p>
            {user.is_verified ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>
        {user.address && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse</h3>
            <div className="text-gray-900">
              <p>{user.address.street}</p>
              <p>{user.address.postal_code} {user.address.city}</p>
              <p>{user.address.country}</p>
            </div>
          </div>
        )}
      </div>

      {user.role === UserRole.GUIDE && (
        <>
          {user?.guide ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profil Guide</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-surfie-green-800 mb-1">Biographie</p>
                    <p className="text-gray-900">{user?.guide.bio || "Aucune biographie"}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-surfie-green-800 mb-1">Langues parlées</p>
                      <p className="text-gray-900">{user?.guide.languages || "Non renseigné"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surfie-green-800 mb-1">Années d'expérience</p>
                      <p className="text-gray-900">
                        {user?.guide.years_of_experience !== null && user?.guide.years_of_experience !== undefined
                          ? `${user?.guide.years_of_experience} an${user?.guide.years_of_experience > 1 ? "s" : ""}`
                          : "Non renseigné"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surfie-green-800 mb-1">Statut du guide</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${user?.guide.guide_status === GuideStatus.PRO
                          ? "bg-purple-600 text-white"
                          : "bg-blue-600 text-white"
                          }`}
                      >
                        {user?.guide.guide_status === GuideStatus.PRO ? "Professionnel" : "Local"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surfie-green-800 mb-1">Pays</p>
                      <p className="text-gray-900">{user?.guide.country || "Non renseigné"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-surfie-green-800">Carte professionnelle :</p>
                      {user?.guide.pro_card ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-surfie-green-800">Profil actif :</p>
                      {user?.guide.is_active ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                  </div>
                  {user?.guide.internal_comment && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <p className="text-sm font-semibold text-yellow-800 mb-1">Commentaire interne</p>
                      <p className="text-gray-900">{user?.guide.internal_comment}</p>
                    </div>
                  )}
                </div>
              </div>

              {user?.guide.documents && user?.guide.documents.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents de vérification</h2>
                  <div className="overflow-hidden rounded-lg border-2 border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-surfie-green-700 to-surfie-green-600">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Date d'upload
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                            Date de vérification
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {user?.guide.documents.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              {doc.document_type}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${doc.verification_status === VerificationStatus.VERIFIED
                                  ? "bg-green-100 text-green-800"
                                  : doc.verification_status === VerificationStatus.REJECTED
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                  }`}
                              >
                                {doc.verification_status === VerificationStatus.VERIFIED
                                  ? "Vérifié"
                                  : doc.verification_status === VerificationStatus.REJECTED
                                    ? "Rejeté"
                                    : "En attente"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {doc.upload_date ? dayjs(doc.upload_date).format("D MMMM YYYY") : "Non renseigné"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {doc.verification_date ? dayjs(doc.verification_date).format("D MMMM YYYY") : "Non renseigné"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {experiences && experiences.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Expériences proposées</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {experiences.map((exp: any) => (
                      <div key={exp.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-surfie-green-600 transition-all">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{exp.title}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-surfie-green-800">Prix:</span>
                            <span className="text-gray-900">{exp.price}€</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-surfie-green-800">Durée:</span>
                            <span className="text-gray-900">{exp.duration} min</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-surfie-green-800">Capacité max:</span>
                            <span className="text-gray-900">{exp.max_capacity || "Non définie"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-surfie-green-800">Publié:</span>
                            {exp.is_published ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircleIcon className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-600 text-sm mt-3 line-clamp-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
              <div className="text-center py-8">
                <XCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Aucun profil guide trouvé pour cet utilisateur.</p>
                <p className="text-gray-500 text-sm mt-1">Le profil guide n'a pas encore été créé ou est inactif.</p>
              </div>
            </div>
          )}
        </>
      )}

      {user.role === UserRole.CLIENT && (
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité Client</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-surfie-green-800 mb-1">Réservations</p>
              <p className="text-3xl font-bold text-gray-900">
                {user.bookings?.length || 0}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-surfie-green-800 mb-1">Avis laissés</p>
              <p className="text-3xl font-bold text-gray-900">
                {user.reviews?.length || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Consentements RGPD</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-surfie-green-800">Consentement marketing :</p>
            {user.marketing_consent ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-surfie-green-800">Traitement des données :</p>
            {user.data_processing_consent ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            ) : (
              <XCircleIcon className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
