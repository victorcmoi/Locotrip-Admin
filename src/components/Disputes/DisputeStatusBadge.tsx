"use client";

import React, { useState, useRef, useEffect } from "react";
import { DisputeStatus, disputeStatusLabels } from "@/schemas/dispute";
import { useUpdateDispute } from "@/services/disputes/updateDispute";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface DisputeStatusBadgeProps {
  disputeId: string;
  currentStatus: DisputeStatus;
  onStatusUpdated: () => void;
}

const STATUS_OPTIONS = [
  { value: DisputeStatus.OPEN, label: disputeStatusLabels[DisputeStatus.OPEN], color: "bg-red-500" },
  { value: DisputeStatus.PENDING, label: disputeStatusLabels[DisputeStatus.PENDING], color: "bg-lightning-yellow-300" },
  { value: DisputeStatus.RESOLVED, label: disputeStatusLabels[DisputeStatus.RESOLVED], color: "bg-surfie-green-600" },
  { value: DisputeStatus.REJECTED, label: disputeStatusLabels[DisputeStatus.REJECTED], color: "bg-gray-500" },
];

export default function DisputeStatusBadge({
  disputeId,
  currentStatus,
  onStatusUpdated,
}: DisputeStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: updateDispute, isPending } = useUpdateDispute();

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

  const handleStatusChange = (newStatus: DisputeStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    updateDispute(
      { id: disputeId, data: { status: newStatus } },
      {
        onSuccess: () => {
          setIsOpen(false);
          onStatusUpdated();
        },
        onError: (error) => {
          console.error("Erreur lors de la mise à jour du statut:", error);
          alert("Erreur lors de la mise à jour du statut du litige");
        },
      }
    );
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm text-white transition-all ${
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
            <span>{currentStatusOption?.label || currentStatus}</span>
            <ChevronDownIcon className="h-3 w-3" />
          </>
        )}
      </button>

      {isOpen && !isPending && (
        <div className="absolute z-50 mt-2 w-40 rounded-lg bg-white shadow-lg border-2 border-gray-200 overflow-hidden">
          {STATUS_OPTIONS.map((option) => (
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
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${option.color}`}
                ></span>
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
