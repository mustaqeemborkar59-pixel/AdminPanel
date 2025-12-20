
"use client";

import React, { useState, useEffect, type ReactNode, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { type User } from 'firebase/auth';
import { useUser, useFirebase } from '@/firebase';
import { getUserProfile, updateUserRole, createUserProfile } from '@/app/auth/actions';
import type { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import { getDatabase, ref, onValue, onDisconnect, set, serverTimestamp, goOffline, goOnline, increment, update } from "firebase/database";


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
  const { rtdb } = useFirebase();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPendingPage = pathname === '/pending-verification';
  
  const loading = authLoading || profileLoading;

  // Effect for managing user presence in Realtime Database
  useEffect(() => {
    if (!user || !rtdb) {
      return;
    }
    
    const uid = user.uid;
    const db = rtdb;
    const userStatusRef = ref(db, `/status/${uid}`);

    const connectedRef = ref(db, '.info/connected');

    let sessionStartTime: number | null = null;
    let timeUpdateInterval: NodeJS.Timeout;

    const unsubscribe = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        sessionStartTime = Date.now();
        
        // Use update instead of set to avoid overwriting time_spent
        update(userStatusRef, {
            state: 'online',
            last_seen: serverTimestamp(),
        });

        onDisconnect(userStatusRef).update({
            state: 'offline',
            last_seen: serverTimestamp(),
            // Use increment to add the session duration to the existing time_spent
            time_spent: increment(Math.floor((Date.now() - (sessionStartTime || Date.now())) / 1000))
        });
        
        // Periodically update time_spent while online
        timeUpdateInterval = setInterval(() => {
           if(sessionStartTime) {
             const currentSessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
             update(userStatusRef, {
                time_spent: increment(currentSessionDuration)
             });
             sessionStartTime = Date.now(); // Reset start time for the next interval
           }
        }, 60000); // every 60 seconds

      }
    });

    return () => {
      clearInterval(timeUpdateInterval);
      if (sessionStartTime) { // Update one last time on cleanup
         const finalSessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
         update(userStatusRef, { time_spent: increment(finalSessionDuration) });
      }
      goOffline(db);
      unsubscribe();
    };
  }, [user, rtdb]);

  useEffect(() => {
    const syncUserProfile = async (currentUser: User) => {
      setProfileLoading(true);
      
      let profileResult = await getUserProfile(currentUser.uid);

      // ** Core Logic: Ensure Firestore Profile Exists **
      // If profile doesn't exist, create it. This is the self-healing mechanism.
      if (!profileResult.success || !profileResult.data) {
        console.log("Profile not found for user, creating one...");
        const creationResult = await createUserProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0],
            photoURL: currentUser.photoURL,
        });

        if (creationResult.success) {
            // Re-fetch the profile after creating it to ensure we have the correct data
            profileResult = await getUserProfile(currentUser.uid);
        } else {
            toast({
                variant: "destructive",
                title: "Critical Profile Error",
                description: "Failed to create a user profile. Please contact support.",
            });
            setUserProfile(null);
            setProfileLoading(false);
            return; // Stop execution if profile can't be created
        }
      }

      let finalProfile = profileResult.success ? profileResult.data : null;

      // ** Self-Correction Logic for Super Admin **
      const isSuperAdminByEmail = currentUser.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
      if (isSuperAdminByEmail && finalProfile && finalProfile.role !== 'super-admin') {
          console.log("Correcting user role to super-admin for:", currentUser.email);
          const updateResult = await updateUserRole(currentUser.uid, 'super-admin');
          if (updateResult.success) {
              const updatedProfileResult = await getUserProfile(currentUser.uid);
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
    };

    if (user && !authLoading) {
      syncUserProfile(user);
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

  // This check is important. If, after all checks, the user is still not approved (e.g., profile creation failed),
  // keep them on a loading/pending screen instead of showing the full layout.
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
