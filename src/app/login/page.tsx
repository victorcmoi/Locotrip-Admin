import { redirect } from "next/navigation";
import React from "react";
import { checkLogin } from "@/lib/auth";
import AdminRoutes from "@/utils/routes";
import LoginForm from "@/components/Auth/LoginForm";
import Link from "next/link";
import Image from "next/image";

export default async function Page() {
  if (await checkLogin()) {
    redirect(AdminRoutes.admin());
  }

  return (
    <div className="flex min-h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">Connectez-vous à votre compte</h2>
            <p className="mt-2 text-sm/6 text-gray-500">
              Un problème ?{' '}
              <Link href="#" className="font-semibold text-surfie-green-600 hover:text-surfie-green-500">
                Contactez-nous
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          alt=""
          src="https://images.unsplash.com/photo-1523867904486-8153c8afb94f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
          className="absolute inset-0 size-full object-cover"
          fill
        />
      </div>
    </div>
  );
}
