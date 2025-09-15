
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const unprotectedRoutes = ['/'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('jwt_token', tokenFromUrl);
      // Clean the URL
      window.history.replaceState(null, '', pathname);
    }

    const token = localStorage.getItem('jwt_token');
    const isProtected = !unprotectedRoutes.includes(pathname);

    if (token) {
      setIsLoggedIn(true);
    } else if (isProtected) {
      router.push('/');
    } else {
      setIsLoggedIn(true); // Allow access to unprotected routes
    }
  }, [pathname, router, searchParams]);

  return isLoggedIn ? <>{children}</> : null;
}
