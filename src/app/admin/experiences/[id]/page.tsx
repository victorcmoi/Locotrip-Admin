"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, StarIcon, UserCircleIcon, CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useExperience } from "@/services/experiences/getExperience";
import { deleteReview } from "@/services/reviews/deleteReview";
import ReviewCard from "@/components/Reviews/ReviewCard";
import BookingDetailsModal from "@/components/Bookings/BookingDetailsModal";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);
dayjs.locale("fr");

const BookingStatusLabel: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmé", className: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulé", className: "bg-red-100 text-red-800" },
  completed: { label: "Terminé", className: "bg-blue-100 text-blue-800" },
};

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;

  const { data: experience, isLoading, error, refetch } = useExperience(experienceId);
  
  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-12 pt-8">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-surfie-green-200 border-t-surfie-green-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement de l&apos;expérience...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="space-y-12 pt-8">
        <div className="p-12 text-center">
          <p className="text-red-600 font-semibold">Expérience introuvable.</p>
        </div>
      </div>
    );
  }

  const averageRating = experience.reviews && experience.reviews.length > 0
    ? experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
    : null;

  return (
    <div className="space-y-8 pt-8">

      {/* Back button and title */}
      <button
        onClick={() => router.back()}
        className="p-2 rounded-lg bg-white border-2 border-gray-200 hover:border-surfie-green-600 transition-all"
      >
        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
      </button>
      
      <div className="border-l-4 border-surfie-green-600 pl-4">
        <h1 className="text-4xl font-bold text-gray-900">{experience.title}</h1>
        {experience.city && (
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" />
            {experience.city.name}, {experience.city.country}
          </p>
        )}
      </div>

      {/* Status badges */}
      <div className="flex gap-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
            experience.is_published
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {experience.is_published ? "Publié" : "Brouillon"}
        </span>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
            experience.is_active
              ? "bg-surfie-green-100 text-surfie-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {experience.is_active ? "Actif" : "Inactif"}
        </span>
        {averageRating !== null && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
            <StarIconSolid className="h-4 w-4 text-yellow-500" />
            {averageRating.toFixed(1)} ({experience.reviews?.length} avis)
          </span>
        )}
      </div>

      {/* General Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations générales</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-surfie-green-800">Prix</p>
              <p className="text-2xl font-bold text-gray-900">{experience.price}€</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-surfie-green-800">Durée</p>
              <p className="text-2xl font-bold text-gray-900">{experience.duration} min</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div> 
              <p className="text-sm font-semibold text-surfie-green-800">Capacité max</p>
              <p className="text-2xl font-bold text-gray-900">{experience.max_capacity || "Non définie"}</p>
            </div>
          </div>
        </div>
        
        {experience.description && (
          <div className="mt-6 pt-6">
            <p className="text-sm font-semibold text-surfie-green-800 mb-2">Description</p>
            <p className="text-gray-700 whitespace-pre-line">{experience.description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <p><span className="font-semibold">Créée le :</span> {experience.created_at ? dayjs(experience.created_at).format("D MMMM YYYY") : "N/A"}</p>
          <p><span className="font-semibold">Modifiée le :</span> {experience.updated_at ? dayjs(experience.updated_at).format("D MMMM YYYY") : "N/A"}</p>
        </div>
      </div>

      {/* Guide Information */}
      {experience.guide && (
        <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guide associé</h2>
          <Link href={`/admin/users/${experience.guide.user_id}`} className="flex items-start gap-4 hover:bg-gray-50 transition-all p-4 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">
                  {experience.guide.user?.first_name} {experience.guide.user?.last_name}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase ${
                  experience.guide.guide_status === "pro"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {experience.guide.guide_status === "pro" ? "Professionnel" : "Local"}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{experience.guide.user?.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="font-semibold text-surfie-green-800">Langues :</span>
                  <span className="text-gray-700 ml-2">{experience.guide.languages || "Non renseigné"}</span>
                </div>
                <div>
                  <span className="font-semibold text-surfie-green-800">Expérience :</span>
                  <span className="text-gray-700 ml-2">
                    {experience.guide.years_of_experience !== null && experience.guide.years_of_experience !== undefined
                      ? `${experience.guide.years_of_experience} an${experience.guide.years_of_experience > 1 ? "s" : ""}`
                      : "Non renseigné"}
                  </span>
                </div>
              </div>
              
              {experience.guide.bio && (
                <p className="mt-4 text-gray-600 text-sm">{experience.guide.bio}</p>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Réservations 
          <span className="text-base font-normal text-gray-500 ml-2">
            ({experience.bookings?.length || 0})
          </span>
        </h2>
        
        {experience.bookings && experience.bookings.length > 0 ? (
          <div className="overflow-hidden rounded-lg border-2 border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-surfie-green-700 to-surfie-green-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Prix total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {experience.bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      <Link href={`/admin/users/${booking.user_id}`} className="block hover:bg-gray-100 transition-colors p-2 rounded-lg">
                        <p className="font-semibold text-gray-900">
                          {booking.user?.first_name} {booking.user?.last_name}
                        </p>
                        <p className="text-gray-500 text-xs">{booking.user?.email}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {booking.booking_date ? dayjs(booking.booking_date).format("D MMMM YYYY") : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.number_of_participants || 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {booking.total_price}€
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        BookingStatusLabel[booking.status || "pending"]?.className || "bg-gray-100 text-gray-800"
                      }`}>
                        {BookingStatusLabel[booking.status || "pending"]?.label || booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <BookingDetailsModal 
                        booking={booking} 
                        experience={{
                          id: experience.id,
                          title: experience.title,
                          city: experience.city,
                          price: experience.price,
                          duration: experience.duration,
                        }}
                        showGuide={false} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Aucune réservation pour cette expérience.</p>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Avis 
          <span className="text-base font-normal text-gray-500 ml-2">
            ({experience.reviews?.length || 0})
          </span>
        </h2>
        
        {experience.reviews && experience.reviews.length > 0 ? (
          <div className="space-y-4">
            {experience.reviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onDelete={handleDeleteReview}
                showDeleteButton={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Aucun avis pour cette expérience.</p>
          </div>
        )}
      </div>
    </div>
  );
}
