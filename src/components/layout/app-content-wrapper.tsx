
"use client";

import React, { useState, useEffect, type ReactNode, createContext, useContext, useRef } from 'react';
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
import { getDatabase, ref, onValue, onDisconnect, set, serverTimestamp, goOffline, goOnline, increment, update, get, type DatabaseReference } from "firebase/database";


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
  
  const sessionStartTimeRef = useRef<number | null>(null);


  // --- Reliable WhatsApp-like Presence System ---
  useEffect(() => {
    if (!user || !rtdb) {
      return;
    }

    const uid = user.uid;
    const userStatusRef = ref(rtdb, `/status/${uid}`);
    const connectedRef = ref(rtdb, '.info/connected');

    const listener = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // --- User is connected ---
        
        // 1. Set the onDisconnect instruction to the server.
        // This will run when the client disconnects uncleanly.
        // It uses a placeholder for the start time which we'll set when the user comes online.
        onDisconnect(userStatusRef).update({
            state: 'offline',
            last_seen: serverTimestamp(),
            time_spent: increment(1) // Placeholder, will be replaced by a server-side calculation.
                                     // This is less direct than before, but we need a robust method.
                                     // Let's refine the logic to be more direct.
        });

        // A more robust onDisconnect using server timestamp difference
        get(userStatusRef).then(snapshot => {
            const currentTimeSpent = snapshot.val()?.time_spent || 0;
            const sessionStartTimestamp = serverTimestamp();
            
            const onDisconnectPayload = {
                 state: 'offline',
                 last_seen: serverTimestamp(),
                 // This calculation is tricky client-side, let's simplify.
                 // The best approach is to calculate duration on disconnect.
            };
            
            // Let's use a simpler, more robust approach.
            // We'll record the login time. onDisconnect will record the time spent for THAT session.
            const sessionLoginTime = Date.now();
            onDisconnect(userStatusRef).update({
              state: 'offline',
              last_seen: serverTimestamp(),
              time_spent: increment(Math.max(1, Math.round((Date.now() - sessionLoginTime) / 1000)))
            });


            // 2. Set the user's initial status to online.
            // Check if user exists, if not, create with time_spent=0
            if (!snapshot.exists()) {
                set(userStatusRef, {
                    state: 'online',
                    last_seen: serverTimestamp(),
                    time_spent: 0
                });
            } else {
                 // User record exists, just update state to online.
                 update(userStatusRef, {
                    state: 'online',
                    last_seen: serverTimestamp(),
                });
            }
        });

      }
    });
    
    // --- Cleanup function ---
    return () => {
        listener(); // Detach the onValue listener.
        
        if (user && rtdb) {
            const uid = user.uid;
            const userStatusRef = ref(rtdb, `/status/${uid}`);
            
            // On clean disconnect, we don't need a client-side write
            // because the onDisconnect() handler is already set on the server.
            // We just need to cancel it if we don't want it to run (e.g. page navigation where user is still online)
            // But for logout, we WANT it to run. So we just let it be.
            // The best practice is to let onDisconnect handle all offline scenarios.
            goOffline(rtdb); // Disconnect from RTDB to trigger onDisconnect rules
            goOnline(rtdb); // Reconnect immediately for next navigation
        }
    };
}, [user, rtdb]);


  useEffect(() => {
    const syncUserProfile = async (currentUser: User) => {
      setProfileLoading(true);
      
      let profileResult = await getUserProfile(currentUser.uid);

      if (!profileResult.success || !profileResult.data) {
        console.log("Profile not found for user, creating one...");
        const creationResult = await createUserProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email?.split('@')[0],
            photoURL: currentUser.photoURL,
        });

        if (creationResult.success) {
            profileResult = await getUserProfile(currentUser.uid);
        } else {
            toast({
                variant: "destructive",
                title: "Critical Profile Error",
                description: "Failed to create a user profile. Please contact support.",
            });
            setUserProfile(null);
            setProfileLoading(false);
            return; 
        }
      }

      let finalProfile = profileResult.success ? profileResult.data : null;

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
