import React from "react";
import { getGuides } from "@/services/guides/getGuides";
import {getUsers} from "@/services/users/getUsers";

export default async function Page() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Utilisateurs</h1>
      <div className="overflow-hidden rounded-md border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          {users.map((g) => (
            <tr key={g.id}>
              <td className="px-4 py-3 text-sm text-gray-900">{g.user?.lastName} {g.user?.firstName}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{g.user?.email}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{g.guide_status}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{g.country ?? '-'}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
