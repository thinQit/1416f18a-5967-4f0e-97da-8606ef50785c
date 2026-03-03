import "@/app/globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: "Shop",
  description: "Next.js 14 app"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider><><Navigation />{children}</></AuthProvider>
      </body>
    </html>
  );
}
