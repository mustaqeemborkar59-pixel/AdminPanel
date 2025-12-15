
"use client";

import React, { useState, useEffect, type ReactNode, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getUserProfile } from '@/app/auth/actions'; // Using new Firestore action
import type { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { Header } from '@/components/layout/header';

interface AppContextType {
  user: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppContentWrapper");
    }
    return context;
};

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
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const profileResult = await getUserProfile(currentUser.uid); // Using new Firestore action
        if (profileResult.success && profileResult.data) {
          setUserProfile(profileResult.data);
        } else {
          setUserProfile(null); 
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (user && userProfile) {
      // Prioritize .env check for super admin for immediate access
      const isEnvSuperAdmin = user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      const { role, vendorCode } = userProfile;
      
      const isPending = !isEnvSuperAdmin && (role === 'user' || (role === 'vendor' && !vendorCode));
      const isApproved = isEnvSuperAdmin || role === 'admin' || (role === 'vendor' && !!vendorCode);

      if (isAuthPage) {
        router.replace('/');
        return;
      }
      
      if (isPending && !isPendingPage) {
        router.replace('/pending-verification');
        return;
      }

      if (isApproved && isPendingPage) {
        router.replace('/');
        return;
      }

    } else if (user && !userProfile) {
        if (!isPendingPage && !isAuthPage) {
             router.replace('/pending-verification');
        }
    } else {
      if (!isAuthPage && !isPendingPage) {
        router.replace('/login');
      }
    }
  }, [user, userProfile, loading, pathname, router, isAuthPage, isPendingPage]);

  if (loading || (user && isAuthPage) || (!user && !isAuthPage && !isPendingPage)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isAuthPage || isPendingPage) {
    return (
      <AppContext.Provider value={{ user, userProfile, authLoading: loading }}>
        {children}
      </AppContext.Provider>
    );
  }
  
  const isEnvSuperAdmin = user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
  if (user && userProfile && !isEnvSuperAdmin && ((userProfile.role === 'user') || (userProfile.role === 'vendor' && !userProfile.vendorCode))) {
       return (
         <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <AppContext.Provider value={{ user, userProfile, authLoading: loading }}>
      <SidebarProvider defaultOpen>
        <Sidebar>
          <AppSidebarNav user={user} userProfile={userProfile} authLoading={loading} />
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AppContext.Provider>
  );
}
