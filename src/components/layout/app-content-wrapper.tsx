
"use client";

import React, { useState, useEffect, type ReactNode, createContext, useContext, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { type User } from 'firebase/auth';
import { useUser, useFirebase, useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore'; // Import onSnapshot
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
  const { user, isUserLoading: authLoading, userError, auth } = useUser();
  const { rtdb, firestore } = useFirebase();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPendingPage = pathname === '/pending-verification';
  
  const loading = authLoading || profileLoading;
  
  const sessionStartTime = useRef<number | null>(null);


  // --- Final & Guaranteed WhatsApp-like Presence System ---
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
        sessionStartTime.current = Date.now();
        
        const onDisconnectRef = onDisconnect(userStatusRef);
        // This will run when the client disconnects uncleanly.
        onDisconnectRef.update({
            state: 'offline',
            last_seen: serverTimestamp(),
            time_spent: increment(Math.max(1, Math.round((Date.now() - (sessionStartTime.current || Date.now())) / 1000)))
        });


        // Set the user's initial status to online.
        get(userStatusRef).then(snapshot => {
            if (!snapshot.exists()) {
                // If user has no presence data, create it with time_spent=0
                set(userStatusRef, {
                    state: 'online',
                    last_seen: serverTimestamp(),
                    time_spent: 0
                });
            } else {
                 // User record exists, just update state to online. Don't touch time_spent.
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
        
        // When component unmounts (e.g., logout), we need to update the time spent
        // for the current session cleanly.
        if (sessionStartTime.current) {
            const sessionDuration = Math.max(1, Math.round((Date.now() - sessionStartTime.current) / 1000));
            update(userStatusRef, {
                state: 'offline',
                last_seen: serverTimestamp(),
                time_spent: increment(sessionDuration)
            });
        }
        if (userStatusRef) {
          onDisconnect(userStatusRef).cancel(); // Important: cancel the onDisconnect plan
        }
        sessionStartTime.current = null;
    };
}, [user, rtdb]);


  useEffect(() => {
    if (!user || !firestore || !auth) {
        setUserProfile(null);
        setProfileLoading(false);
        return;
    }

    setProfileLoading(true);

    const userDocRef = doc(firestore, 'users', user.uid);
    
    // Real-time listener for user profile changes
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const profileData = docSnap.data() as UserProfile;

        // Force logout if user is blocked
        if (profileData.status === 'blocked') {
          toast({
            variant: "destructive",
            title: "Account Blocked",
            description: "Your account has been blocked by an administrator.",
          });
          await auth.signOut();
          router.replace('/login');
          return;
        }

        // Handle role corrections for super admin
        const isSuperAdminByEmail = user.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
        if (isSuperAdminByEmail && profileData.role !== 'super-admin') {
            console.log("Correcting user role to super-admin for:", user.email);
            await updateUserRole(user.uid, 'super-admin');
            // The onSnapshot listener will pick up this change and re-run, so we don't need to manually set state here.
        } else {
            setUserProfile(profileData);
        }

      } else {
        // Profile doesn't exist, create it.
        console.log("Profile not found for user, creating one...");
        const creationResult = await createUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            photoURL: user.photoURL,
        });

        if (!creationResult.success) {
          toast({
            variant: "destructive",
            title: "Critical Profile Error",
            description: "Failed to create your user profile. Please contact support.",
          });
          await auth.signOut();
        }
        // The onSnapshot will trigger again once the profile is created.
      }
      setProfileLoading(false);
    }, (error) => {
        console.error("Error listening to user profile:", error);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not sync your user profile.",
        });
        setProfileLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount

  }, [user, firestore, toast, router, auth]);


  useEffect(() => {
    if (loading) return;

    if (user) {
      const role = userProfile?.role;
      const vendorCode = userProfile?.vendorCode;
      
      const isApproved = role === 'admin' || role === 'super-admin' || (role === 'vendor' && !!vendorCode);
      const isPending = userProfile && !isApproved; // Check if profile exists but isn't approved

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
      if (!isAuthPage && !isPendingPage) { // Don't redirect from pending page if logged out
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
