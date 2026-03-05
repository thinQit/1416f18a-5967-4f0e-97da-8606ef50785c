import type { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import './globals.css';
import Navigation from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: "ProdDash",
  description: "Product dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider><><Navigation />{children}</></AuthProvider>
      </body>
    </html>
  );
}
