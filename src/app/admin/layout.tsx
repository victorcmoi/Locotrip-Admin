import { redirect } from "next/navigation";
import React from "react";
import { checkLogin } from "@/lib/auth";
import AdminRoutes from "@/utils/routes";
import AuthHandler from "@/components/Auth/AuthHandler";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import logo from "@/assets/images/logo_square.png";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function Layout({ children }: LayoutProps) {

  if (!(await checkLogin())) {
    redirect(AdminRoutes.login());
  }

  const session = await getServerSession(authOptions);
  console.log(session)
  const token = session?.accessToken;

  if (!token) {
    redirect(AdminRoutes.login());
  }

  return (
    <AuthHandler>
      <div className="flex min-h-screen p-8 gap-8 bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 flex flex-col gap-4">
          <Image src={logo} alt="Logo Locotrip" className="w-full h-fit object-contain px-4 py-2" />
          <div className="bg-surfie-green-700 flex flex-col justify-between flex-1 p-4 rounded-lg">
            <nav className="flex flex-col gap-2 text-white font-semibold">
              <Link href={AdminRoutes.dashboard()} className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-black/10 duration-300">
                Dashboard
              </Link>
              <Link href={AdminRoutes.users()} className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-black/10 duration-300">
                Utilisateurs
              </Link>
              <Link href={AdminRoutes.settings()} className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-black/10 duration-300">
                Paramètre
              </Link>
            </nav>
            <div className="mt-1 text-sm text-white flex flex-col gap-1 cursor-pointer hover:bg-black/10 duration-300 rounded-md px-4 py-4">
              <div className="flex gap-3 items-center">
                <UserCircleIcon className="h-8 w-auto" />
                <span className="font-medium text-xl">{session?.user?.firstName} {session?.user?.lastName}</span>
              </div>
              <span className="text-xs opacity-80 ml-11">{session?.user?.role}</span>
            </div>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthHandler>
  );
}
