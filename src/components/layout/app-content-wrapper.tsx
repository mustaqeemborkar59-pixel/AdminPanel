
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
  const [loading, setLoading] = useState(true); // True until first onAuthStateChanged call

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const authInstance = getAuth(app);
    // This listener fires on initial load and any time the auth state changes
    const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // setLoading(false) after the first determination of auth state
    });
    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // This effect handles redirection based on auth state and current path
    if (!loading) { // Only run redirects if initial auth check is complete
      if (isAuthPage && user) { // User is logged in but on an auth page
        if (pathname !== '/') router.replace('/'); // Redirect to dashboard
      } else if (!isAuthPage && !user) { // User is not logged in but on a protected page
        if (pathname !== '/login') router.replace('/login'); // Redirect to login
      }
    }
  }, [user, loading, pathname, router, isAuthPage]); // Re-run when any of these change


  // If initial auth state is still being determined, show a global loader.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // Initial auth state determined. Now, decide what to render based on auth status and route.

  // If on an authentication page (login/signup):
  if (isAuthPage) {
    if (user) {
      // User is authenticated but somehow still on an auth page.
      // The useEffect above will trigger a redirect to '/'. Show a loader during this transition.
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    // User is not authenticated and on an auth page. Show the auth page content (login/signup form).
    return <>{children}</>;
  }

  // If on a protected page (not /login or /signup):
  if (!user) {
    // User is not authenticated but on a protected page.
    // The useEffect above will trigger a redirect to '/login'. Show a loader during this transition.
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // User is authenticated and on a protected page. Show the main application layout.
  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        {/* authLoading is false here because the main 'loading' state is already false,
            and we've confirmed a 'user' exists. */}
        <AppSidebarNav user={user} authLoading={false} />
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
