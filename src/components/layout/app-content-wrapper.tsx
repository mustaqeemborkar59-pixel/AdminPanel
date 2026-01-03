
"use client";

import React, { useState, useEffect, type ReactNode, createContext, useContext, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { type User } from 'firebase/auth';
import { useUser, useFirebase, useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { createUserProfile, manageUserSession } from '@/app/auth/actions';
import type { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { Header } from '@/components/layout/header';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';


const SESSION_ID_KEY = 'app_session_id';

const getSessionId = (): string => {
    if (typeof window !== 'undefined') {
        // Use sessionStorage to ensure each tab gets a unique session ID
        let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
        if (!sessionId) {
            sessionId = uuidv4();
            sessionStorage.setItem(SESSION_ID_KEY, sessionId);
        }
        return sessionId;
    }
    return '';
};


interface AppContextType {
  user: User | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  refreshUserProfile: () => Promise<void>;
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
  const { firestore } = useFirebase();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sessionId] = useState(getSessionId());

  // Ref to prevent logout race condition on new login
  const isLoggingInRef = useRef(false);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isPendingPage = pathname === '/pending-verification';
  
  const loading = authLoading || profileLoading;

  const refreshUserProfile = useCallback(async () => {
    if (user && firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const { getDoc } = await import('firebase/firestore');
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      }
    }
  }, [user, firestore]);

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
        
        // If we are not in the process of logging in, check for session conflicts.
        if (!isLoggingInRef.current && profileData.activeSessionId && profileData.activeSessionId !== sessionId) {
            await auth.signOut();
            return;
        }
        
        setUserProfile(profileData);

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

  }, [user, firestore, toast, router, auth, sessionId]);

  // Effect to manage session on login
   useEffect(() => {
    if (user && !loading) {
      const deviceInfo = `${navigator.userAgent}`;
      
      // Set the flag to true before managing session to prevent race condition
      isLoggingInRef.current = true;
      manageUserSession(user.uid, sessionId, deviceInfo, 'login');
      
      // Reset the flag after a short delay to allow the new session ID to propagate
      setTimeout(() => {
        isLoggingInRef.current = false;
      }, 2000); // 2 seconds should be enough for the backend to update
    }
  }, [user, loading, sessionId]);


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
      <AppContext.Provider value={{ user, userProfile, authLoading: loading, refreshUserProfile }}>
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
    <AppContext.Provider value={{ user, userProfile, authLoading: loading, refreshUserProfile }}>
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
