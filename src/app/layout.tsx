import './globals.css';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/providers/AuthProvider';
import Navigation from '@/components/layout/Navigation';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider><><Navigation />{children}</></AuthProvider>
      </body>
    </html>
  );
}
