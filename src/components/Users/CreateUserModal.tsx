"use client";

import React, { useState } from "react";
import Modal from "@/components/Globals/Modal";
import { useCreateUser } from "@/services/users/createUser";
import { CreateUserSchema, UserRole } from "@/schemas/user";
import { z } from "zod";
import { toast } from "sonner";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserSchema>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: UserRole.CLIENT,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createUser, isPending, error } = useCreateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        role: formData.role,
      };

      createUser(validatedData, {
        onSuccess: () => {
          toast.success("Utilisateur créé avec succès");
          setFormData({
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            role: UserRole.CLIENT,
          });
          onClose();
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error("Une erreur est survenue lors de la création de l'utilisateur");
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      role: UserRole.CLIENT,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Créer un nouvel utilisateur">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-sm text-red-800 font-medium">
              Une erreur est survenue lors de la création de l&apos;utilisateur.
            </p>
            <p className="text-xs text-red-700 mt-1">{error.message}</p>
          </div>
        )}

        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-surfie-green-800 mb-2">
            Prénom <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`block w-full rounded-lg border-2 ${errors.firstName ? "border-red-600" : "border-gray-200"
              } py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all`}
            placeholder="Jean"
          />
          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-surfie-green-800 mb-2">
            Nom <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`block w-full rounded-lg border-2 ${errors.lastName ? "border-red-600" : "border-gray-200"
              } py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all`}
            placeholder="Dupont"
          />
          {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-surfie-green-800 mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`block w-full rounded-lg border-2 ${errors.email ? "border-red-600" : "border-gray-200"
              } py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all`}
            placeholder="jean.dupont@exemple.fr"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-surfie-green-800 mb-2">
            Mot de passe <span className="text-red-600">*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`block w-full rounded-lg border-2 ${errors.password ? "border-red-600" : "border-gray-200"
              } py-2.5 px-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all`}
            placeholder="Minimum 8 caractères"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-surfie-green-800 mb-2">
            Rôle <span className="text-red-600">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`block w-full rounded-lg border-2 ${errors.role ? "border-red-600" : "border-gray-200"
              } py-2.5 px-3 text-gray-900 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all`}
          >
            <option value={UserRole.CLIENT}>Client</option>
            <option value={UserRole.GUIDE}>Guide</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-surfie-green-700 to-surfie-green-600 text-white font-semibold rounded-lg hover:from-surfie-green-800 hover:to-surfie-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                Création...
              </span>
            ) : (
              "Créer"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
