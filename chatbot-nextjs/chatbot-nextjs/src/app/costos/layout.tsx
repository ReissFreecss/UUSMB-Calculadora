// app/costos/layout.tsx
'use client';

import { AuthProvider } from '@/context/AuthContext';

export default function CostosLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
