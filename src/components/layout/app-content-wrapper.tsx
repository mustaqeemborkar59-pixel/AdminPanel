
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
          // Profile doesn't exist or failed to fetch. This can happen right after signup.
          // Treat as unverified. The next effect will handle redirects.
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
      
      // If a logged-in user is on an auth page, they should be redirected home.
      if (isAuthPage) {
        router.replace('/');
        return;
      }
      
      // If the user has the 'user' role (and is not the super admin) and is not already on the pending page,
      // redirect them to the pending verification page. This is the core of the access control.
      if (role === 'user' && !isSuperAdmin && !isPendingPage) {
        router.replace('/pending-verification');
        return;
      }

      // If the user is verified (role is not 'user') but they are on the pending page,
      // it means they've been approved. Redirect them home.
      if (role && role !== 'user' && isPendingPage) {
        router.replace('/');
        return;
      }

    } else {
      // No user is logged in.
      // If they are not on a public page (auth or pending), redirect them to login.
      if (!isAuthPage && !isPendingPage) {
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
    // If a logged-in user is on an auth page, a redirect is in progress. Show a loader to prevent flicker.
    if(user && isAuthPage) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    return <>{children}</>;
  }
  
  // If user is not authenticated on a protected page, a redirect is happening. Show loader.
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
