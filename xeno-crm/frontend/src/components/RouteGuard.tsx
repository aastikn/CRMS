'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    return null; // Or a redirect message, though router.push should handle it
  }

  return <>{children}</>;
}
