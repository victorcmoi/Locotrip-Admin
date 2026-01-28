"use client";

import React, { useState, useRef, useEffect } from "react";
import { VerificationStatus } from "@/schemas/guide";
import { useUpdateGuideDocument } from "@/services/guides/updateGuideDocument";
import { ChevronDownIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

interface DocumentStatusBadgeProps {
  guideId: string;
  documentId: string;
  currentStatus: typeof VerificationStatus[keyof typeof VerificationStatus];
  onStatusUpdated?: () => void;
}

const STATUS_OPTIONS = [
  { 
    value: VerificationStatus.PENDING, 
    label: "En attente", 
    color: "bg-yellow-500",
    icon: ClockIcon 
  },
  { 
    value: VerificationStatus.VERIFIED, 
    label: "Vérifié", 
    color: "bg-green-500",
    icon: CheckCircleIcon 
  },
  { 
    value: VerificationStatus.REJECTED, 
    label: "Rejeté", 
    color: "bg-red-500",
    icon: XCircleIcon 
  },
];

export default function DocumentStatusBadge({
  guideId,
  documentId,
  currentStatus,
  onStatusUpdated,
}: DocumentStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: updateDocument, isPending } = useUpdateGuideDocument();

  const currentStatusOption = STATUS_OPTIONS.find(
    (option) => option.value === currentStatus
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = (newStatus: typeof VerificationStatus[keyof typeof VerificationStatus]) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    updateDocument(
      { guideId, documentId, data: { verification_status: newStatus } },
      {
        onSuccess: () => {
          toast.success("Statut du document mis à jour");
          setIsOpen(false);
          onStatusUpdated?.();
        },
        onError: (error) => {
          console.error("Erreur lors de la mise à jour du statut:", error);
          toast.error("Erreur lors de la mise à jour du statut du document");
        },
      }
    );
  };

  const CurrentIcon = currentStatusOption?.icon || ClockIcon;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm text-white transition-all ${
          currentStatusOption?.color || "bg-gray-200"
        } ${
          isPending
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90 cursor-pointer"
        }`}
      >
        {isPending ? (
          <>
            <div className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
            <span>Mise à jour...</span>
          </>
        ) : (
          <>
            <CurrentIcon className="h-3.5 w-3.5" />
            <span>{currentStatusOption?.label || currentStatus}</span>
            <ChevronDownIcon className="h-3 w-3" />
          </>
        )}
      </button>

      {isOpen && !isPending && (
        <div className="absolute z-50 mt-2 w-40 rounded-lg bg-white shadow-lg border-2 border-gray-200 overflow-hidden">
          {STATUS_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                  option.value === currentStatus
                    ? "bg-surfie-green-50 text-surfie-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${option.color.replace('bg-', 'text-').replace('-500', '-600')}`} />
                  <span>{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
