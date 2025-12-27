import React from "react";
import { getUsers } from "@/services/users/getUsers";

export default async function Page() {
  const response = await getUsers();
  const users = response.data;

  return (
    <div>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Utilisateurs</h1>
      <div className="overflow-hidden rounded-md border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{user.last_name} {user.first_name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
