"use client";

import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type ModalSize = "small" | "medium" | "large";

type ModalProps = {
  isOpen: boolean;
  size?: ModalSize;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

const SIZE_CLASSES: Record<ModalSize, string> = {
  small: "max-w-md",
  medium: "max-w-lg",
  large: "max-w-2xl",
};

export default function Modal({
  isOpen,
  size = "medium",
  onClose,
  title,
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className={`
          bg-white rounded-xl shadow-2xl w-full
          ${SIZE_CLASSES[size]}
          max-h-[90vh] overflow-y-auto
          animate-in zoom-in-95 duration-200
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-surfie-green-700 to-surfie-green-600 px-6 py-4 flex items-center justify-between border-b border-surfie-green-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors duration-200"
            aria-label="Fermer"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
