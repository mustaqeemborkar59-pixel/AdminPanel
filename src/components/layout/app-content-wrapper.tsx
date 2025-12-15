
"use client";

import React, { useState, useEffect, type ReactNode, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { type User } from 'firebase/auth';
import { useUser } from '@/firebase';
import { getUserProfile, updateUserRole } from '@/app/auth/actions';
import type { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const { user, isUserLoading: authLoading, userError } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPendingPage = pathname === '/pending-verification';
  
  const loading = authLoading || profileLoading;

  useEffect(() => {
    if (user && !authLoading) {
      setProfileLoading(true);
      getUserProfile(user.uid).then(async (profileResult) => {
        let finalProfile = profileResult.success ? profileResult.data : null;

        // ** Self-Correction Logic for Super Admin **
        // Check if the logged-in user IS the super admin but their role in DB is NOT super-admin
        const isSuperAdminByEmail = user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
        
        if (isSuperAdminByEmail && finalProfile && finalProfile.role !== 'super-admin') {
            console.log("Correcting user role to super-admin for:", user.email);
            const updateResult = await updateUserRole(user.uid, 'super-admin');
            if (updateResult.success) {
                // If role updated successfully, re-fetch the profile to get the latest data
                const updatedProfileResult = await getUserProfile(user.uid);
                if (updatedProfileResult.success && updatedProfileResult.data) {
                    finalProfile = updatedProfileResult.data;
                    toast({
                        title: "Role Corrected",
                        description: "Your role has been updated to Super Admin.",
                    });
                }
            } else {
                 toast({
                    variant: "destructive",
                    title: "Role Correction Failed",
                    description: updateResult.message || "Could not update your role automatically.",
                });
            }
        }
        
        setUserProfile(finalProfile || null);
        setProfileLoading(false);
      });
    } else if (!user && !authLoading) {
      setUserProfile(null);
      setProfileLoading(false);
    }
  }, [user, authLoading, toast]);


  useEffect(() => {
    if (loading) return;

    if (user) {
      const role = userProfile?.role;
      const vendorCode = userProfile?.vendorCode;
      
      const isApproved = role === 'admin' || role === 'super-admin' || (role === 'vendor' && !!vendorCode);
      const isPending = !isApproved;


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

    } else {
      if (!isAuthPage) {
        router.replace('/login');
      }
    }
  }, [user, userProfile, loading, pathname, router, isAuthPage, isPendingPage]);

  if (loading || (user && isAuthPage) || (!user && !isAuthPage)) {
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
  
  const role = userProfile?.role;
  const isApproved = role === 'admin' || role === 'super-admin' || (role === 'vendor' && !!userProfile.vendorCode);

  if (user && !isApproved) {
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
