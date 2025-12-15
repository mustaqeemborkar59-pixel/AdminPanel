
"use client";

import React, { useState, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getRTDBUserProfile } from '@/app/auth/actions'; // We need this to check role
import type { UserProfile } from '@/types';
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPendingPage = pathname === '/pending-verification';

  useEffect(() => {
    const authInstance = getAuth(app);
    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      setLoading(true); // Start loading on any auth state change
      if (currentUser) {
        setUser(currentUser);
        // User is logged in, now fetch their profile from RTDB to check the role
        const profileResult = await getRTDBUserProfile(currentUser.uid);
        if (profileResult.success && profileResult.data) {
          setUserProfile(profileResult.data);
        } else {
          // Profile doesn't exist or failed to fetch. This can happen right after signup
          // if there's a race condition. Treat as unverified for now.
          setUserProfile(null); 
        }
      } else {
        // No user is logged in
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // Don't do anything until initial auth check and profile fetch is done

    if (user) {
      // User is authenticated
      const isSuperAdmin = user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      const role = userProfile?.role;
      
      if (isAuthPage) {
        router.replace('/');
        return;
      }
      
      // CRITICAL: This is the main access control logic.
      // If the user's role is 'user' (and they are not the designated super admin),
      // they MUST be on the pending page. If they are anywhere else, redirect them.
      if (role === 'user' && !isSuperAdmin && !isPendingPage) {
        router.replace('/pending-verification');
        return;
      }

      // If a user has been approved (role is not 'user' anymore) but they land on the pending page,
      // redirect them to the dashboard.
      if (role && role !== 'user' && isPendingPage) {
        router.replace('/');
        return;
      }

    } else {
      // User is not authenticated.
      // If they are trying to access a protected page, redirect to login.
      if (!isAuthPage && !isPendingPage) {
        router.replace('/login');
      }
    }
  }, [user, userProfile, loading, pathname, router, isAuthPage, isPendingPage]);

  // Global loader: active during initial auth check and while redirecting.
  if (loading || (user && isAuthPage) || (!user && !isAuthPage && !isPendingPage)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  // If user is on an auth or pending page, render the page without the main layout.
  if (isAuthPage || isPendingPage) {
    return <>{children}</>;
  }

  // If a logged in user with role 'user' somehow slips past the redirect, show a loader
  // while the redirect to /pending-verification happens.
  if (user && userProfile?.role === 'user' && user.email !== process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL) {
       return (
         <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
  }

  // User is authenticated and verified, show the main application layout
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
