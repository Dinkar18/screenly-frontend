'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        router.push('/login');
      } else if (requireRole && user.role !== requireRole) {
        router.push('/');
      }
    }
  }, [isHydrated, user, requireRole, router]);

  // While hydrating or if not authenticated/unauthorized, don't flash the protected page
  if (!isHydrated || !user || (requireRole && user.role !== requireRole)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
