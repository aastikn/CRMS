'use client';

import { AuthContext } from '../contexts/AuthContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const authContextValue = {};

  return (
    <AuthContext value={authContextValue}>
      {children}
    </AuthContext>
  );
}
