"use client";

import React, { useState, useEffect } from "react";
import { useUsers } from "@/services/users/getUsers";
import { UserRole, UserApiResponseSchema } from "@/schemas/user";
import { ArrowTopRightOnSquareIcon, MagnifyingGlassIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import AdminRoutes from "@/utils/routes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CreateUserModal from "@/components/Users/CreateUserModal";
import ConfirmDeleteModal from "@/components/Users/ConfirmDeleteModal";
import { useDeleteUser } from "@/services/users/deleteUser";
import { toast } from "sonner";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export default function Page() {
  const [roleFilter, setRoleFilter] = useState<typeof UserRole[keyof typeof UserRole] | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserApiResponseSchema | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: response, isLoading, error } = useUsers({
    role: roleFilter || undefined,
    search: debouncedSearch || undefined,
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users = response?.data || [];

  const handleDeleteClick = (user: UserApiResponseSchema) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (reason?: string) => {
    if (userToDelete) {
      deleteUser({ userId: userToDelete.id, reason }, {
        onSuccess: () => {
          toast.success("Utilisateur supprimé avec succès");
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        },
        onError: () => {
          toast.error("Une erreur est survenue lors de la suppression de l'utilisateur");
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        },
      });
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-12 pt-8">
      <div className="flex items-start justify-between gap-4">
        <div className="border-l-4 border-surfie-green-600 pl-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Utilisateurs
          </h1>
          <p className="text-sm text-gray-600 mt-2">Gérez les utilisateurs de la plateforme Locotrip</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-surfie-green-700 to-surfie-green-600 text-white font-semibold rounded-lg hover:from-surfie-green-800 hover:to-surfie-green-700 transition-all duration-200 shadow-md"
        >
          <PlusIcon className="h-5 w-5" />
          Créer un utilisateur
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-surfie-green-600">
        <div className="flex flex-col sm:flex-row gap-4">
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-lg border-2 border-gray-200 py-2.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all"
                placeholder="Rechercher par nom, prénom ou email..."
              />
            </div>
          </div>

          <div className="sm:w-64">
            <label htmlFor="role" className="block text-sm font-semibold text-surfie-green-800 mb-2">
              Filtrer par rôle
            </label>
            <select
              id="role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof UserRole[keyof typeof UserRole] | "")}
              className="block w-full rounded-lg border-2 border-gray-200 py-2.5 px-3 text-gray-900 focus:border-surfie-green-600 focus:ring-2 focus:ring-surfie-green-600/20 sm:text-sm transition-all"
            >
              <option value="">Tous les rôles</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.GUIDE}>Guide</option>
              <option value={UserRole.CLIENT}>Client</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-md">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-surfie-green-200 border-t-surfie-green-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Chargement des utilisateurs...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-red-600 font-semibold">Une erreur est survenue lors du chargement des utilisateurs.</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 font-medium">Aucun utilisateur trouvé.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-surfie-green-700 to-surfie-green-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Nom</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Prénom</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Création</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.last_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.first_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === UserRole.ADMIN
                      ? 'bg-lightning-yellow-300 text-white shadow-sm'
                      : user.role === UserRole.GUIDE
                        ? 'bg-surfie-green-600 text-white shadow-sm'
                        : 'bg-gray-200 text-gray-700'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.created_at ? dayjs(user.created_at).format("D MMMM YYYY") : "Non renseigné"}
                  </td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <Link
                      href={AdminRoutes.userDetail(user.id)}
                      className="bg-gray-100 p-2 rounded-lg w-fit aspect-square hover:bg-gray-200 duration-300"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="bg-red-100 p-2 rounded-lg w-fit aspect-square hover:bg-red-200 duration-300 cursor-pointer"
                      aria-label="Supprimer l'utilisateur"
                    >
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {response && users.length > 0 && (
        <div className="text-sm">
          Affichage de <strong className="font-bold">{users.length}</strong> utilisateur{users.length > 1 ? 's' : ''} sur <strong className="font-bold">{response.meta.total}</strong> au total
        </div>
      )}

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? `${userToDelete.first_name} ${userToDelete.last_name}` : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
