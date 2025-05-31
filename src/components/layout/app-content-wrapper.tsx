
"use client";

import React, { useState, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase'; 
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
// Toaster is now global in RootLayout
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

  // Scenario 1: On an auth page, and user is NOT authenticated -> Show auth page content directly
  if (isAuthPage && !user) {
    return <>{children}</>;
  }

  // Scenario 2: On a protected page, and user IS authenticated -> Show app with sidebar/header
  if (!isAuthPage && user) {
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
          {/* Toaster removed from here, it's now global in RootLayout */}
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  // Fallback: Handles redirection period or unexpected states
  // e.g. user is on auth page but IS authenticated (useEffect will redirect to '/')
  // OR user is on protected page but IS NOT authenticated (useEffect will redirect to '/login')
  // During this redirection, show a loader.
  if ((isAuthPage && user) || (!isAuthPage && !user)) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // This case should ideally not be reached if the logic above is exhaustive.
  // Shows a loader as a default fallback.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
