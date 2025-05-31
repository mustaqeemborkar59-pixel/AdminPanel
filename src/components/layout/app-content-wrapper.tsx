
"use client";

import React, { useState, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase'; 
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { Header } from '@/components/layout/header';

interface AppContentWrapperProps {
  children: ReactNode;
}

export function AppContentWrapper({ children }: AppContentWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isAuthPage && user && pathname !== '/') {
        router.replace('/');
      } else if (!isAuthPage && !user && pathname !== '/login') {
        router.replace('/login');
      }
    }
  }, [user, loading, pathname, router, isAuthPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Scenario 1: On an auth page (login/signup)
  if (isAuthPage) {
    if (user) {
      // User is authenticated but on an auth page, useEffect above will redirect to '/'
      // Show loader during this brief period.
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    // User is not authenticated and on an auth page, show the auth page content directly
    return <>{children}</>;
  }

  // Scenario 2: On a protected page (any page that is not an auth page)
  if (!user) {
    // User is not authenticated and on a protected page, useEffect above will redirect to '/login'
    // Show loader during this brief period.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // User is authenticated and on a protected page, show the app with sidebar/header
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <AppSidebarNav user={user} authLoading={loading} />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
