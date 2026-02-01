"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StarIcon, UserCircleIcon, TrashIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { ReviewSchema } from "@/schemas/review";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import ConfirmDeleteReviewModal from "@/components/Reviews/ConfirmDeleteReviewModal";
import { toast } from "sonner";

dayjs.locale("fr");

interface ExperienceInfo {
  id: string;
  title: string;
  city?: {
    name: string;
    country: string;
  } | null;
}

interface ReviewCardProps {
  review: ReviewSchema;
  experience?: ExperienceInfo | null;
  onDelete?: (reviewId: string) => Promise<void>;
  showDeleteButton?: boolean;
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        star <= rating ? (
          <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
        ) : (
          <StarIcon key={star} className="h-4 w-4 text-gray-300" />
        )
      ))}
    </div>
  );
}

export default function ReviewCard({ review, experience, onDelete, showDeleteButton = true }: ReviewCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userName = review.user 
    ? `${review.user.first_name} ${review.user.last_name}` 
    : "Utilisateur inconnu";

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(review.id);
      toast.success("Avis supprimé avec succès");
      handleCloseModal();
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Erreur lors de la suppression de l'avis");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConfirmDeleteReviewModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        userName={userName}
        isDeleting={isDeleting}
      />
      
      <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-surfie-green-600 transition-colors">
        <div className="flex items-start justify-between">
          <Link 
            href={`/admin/users/${review.user?.id || review.user_id}`} 
            className="flex items-center gap-3 hover:bg-gray-50 transition-all p-4 rounded-lg"
          >
            <div className="p-2 bg-gray-100 rounded-full">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{userName}</p>
              <p className="text-gray-500 text-xs">{review.user?.email}</p>
            </div>
          </Link>
          <div className="flex items-start gap-4">
            <div className="text-right">
              <RatingStars rating={review.rating} />
              <p className="text-xs text-gray-500 mt-1">
                {review.review_date ? dayjs(review.review_date).format("D MMMM YYYY") : ""}
              </p>
            </div>
            {showDeleteButton && onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer cet avis"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Experience Info */}
        {experience && (
          <Link 
            href={`/admin/experiences/${experience.id}`}
            className="mt-3 w-fit flex items-center gap-2 text-sm text-surfie-green-700 bg-surfie-green-50 px-3 py-2 rounded-lg hover:bg-surfie-green-100 transition-colors"
          >
            <MapPinIcon className="h-4 w-4" />
            <span className="font-medium">{experience.title}</span>
            {experience.city && (
              <span className="text-surfie-green-600">• {experience.city.name}</span>
            )}
          </Link>
        )}
        
        {review.title && (
          <h4 className="font-semibold text-gray-900 mt-3">{review.title}</h4>
        )}
        {review.comment && (
          <p className="text-gray-700 mt-2">{review.comment}</p>
        )}
      </div>
    </>
  );
}
