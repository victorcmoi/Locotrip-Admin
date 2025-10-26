import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import QueryClientProvider from "@/providers/query-client.provider";
import NextAuthProvider from "@/providers/next-auth.provider";

export const metadata: Metadata = {
  title: "Admin | Locotrip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className="flex flex-col h-screen antialiased"
      >
      <QueryClientProvider>
        <NextAuthProvider>
          {children}
          <Toaster richColors />
        </NextAuthProvider>
      </QueryClientProvider>
      </body>
    </html>
  );
}
