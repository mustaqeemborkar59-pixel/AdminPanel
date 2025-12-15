
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
      if (currentUser) {
        setUser(currentUser);
        // User is logged in, now fetch their profile from RTDB to check the role
        const profileResult = await getRTDBUserProfile(currentUser.uid);
        if (profileResult.success && profileResult.data) {
          setUserProfile(profileResult.data);
        } else {
          // Profile doesn't exist or failed to fetch, treat as unverified
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
    if (loading) return; // Don't do anything until initial auth check is done

    if (user) {
      // User is logged in
      const isSuperAdmin = user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      const role = userProfile?.role;
      
      if (isAuthPage) {
        // Logged-in user on an auth page, redirect to home
        router.replace('/');
        return;
      }
      
      if (role === 'user' && !isSuperAdmin && !isPendingPage) {
        // This is a new, unverified user. Redirect them to the pending page.
        // We also check if they are the super admin, who should have access everywhere.
        router.replace('/pending-verification');
        return;
      }

      if (role !== 'user' && isPendingPage) {
        // User is verified but somehow on the pending page, redirect home.
        router.replace('/');
        return;
      }

    } else {
      // No user is logged in
      if (!isAuthPage && !isPendingPage) { // Allow access to pending page even if logged out, for display
        router.replace('/login');
      }
    }
  }, [user, userProfile, loading, pathname, router, isAuthPage, isPendingPage]);

  // Global loader while we determine auth state and user role
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If we are on a page that doesn't require the main layout
  if (isAuthPage || isPendingPage) {
    // If user is present but on these pages, a redirect is in progress. Show a loader.
    if(user && isAuthPage) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    return <>{children}</>;
  }
  
  // If user is not authenticated on a protected page, redirect is happening
  if (!user) {
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
