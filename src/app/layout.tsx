import "./global.css";
import { AuthProvider } from "@/providers/AuthProvider";
import Navigation from '@/components/layout/Navigation';

export const metadata = {
  title: "App",
  description: "Next.js application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <AuthProvider><><Navigation />{children}</></AuthProvider>
      </body>
    </html>
  );
}
