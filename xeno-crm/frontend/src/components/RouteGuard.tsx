'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('jwt_token');
    const tokenFromUrl = searchParams.get('token');

    if (tokenFromStorage || tokenFromUrl) {
      setIsAuthenticated(true);
    } else {
      router.push('/');
    }
  }, [router, searchParams]);

  // Render children only when authenticated. A loading spinner could be returned here.
  return isAuthenticated ? <>{children}</> : null;
}
