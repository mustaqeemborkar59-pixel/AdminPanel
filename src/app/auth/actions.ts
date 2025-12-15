
"use server";

import { redirect } from 'next/navigation';
import { rtdb } from '@/lib/firebase';
import { ref, set, get, update } from 'firebase/database';
import type { UserProfile } from '@/types';

// Stripped down version for signup, role is handled internally
interface UserProfileOnSignup {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

interface CompanyDetails {
    companyName: string;
    address: string;
    city: string;
    email: string;
}

export async function createRTDBUserProfileOnSignup(details: UserProfileOnSignup): Promise<{ success: boolean; message?: string }> {
  if (!rtdb) {
    return { success: false, message: "Realtime Database is not configured." };
  }
  try {
    const userRef = ref(rtdb, `users/${details.uid}`);
    // Explicitly set the role to 'user' for every new signup
    const userProfile: UserProfile = {
      uid: details.uid,
      email: details.email || 'No email',
      displayName: details.displayName || 'New User',
      photoURL: details.photoURL || '',
      role: 'user', // Default role
    };
    await set(userRef, userProfile);
    return { success: true };
  } catch (error: any) {
    console.error('Profile Creation Error on Signup:', error);
    return { success: false, message: error.message || 'Failed to create user profile in database.' };
  }
}

// This action is to fetch a single user's profile, which we'll need for role checking
export async function getRTDBUserProfile(uid: string): Promise<{ success: boolean; data?: UserProfile; message?: string }> {
    if (!rtdb) {
        return { success: false, message: "Realtime Database is not configured." };
    }
    try {
        const userRef = ref(rtdb, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() as UserProfile };
        }
        return { success: false, message: "User profile not found." };
    } catch (error: any) {
        console.error('Failed to get user profile from RTDB:', error);
        return { success: false, message: error.message || 'Failed to fetch user profile.' };
    }
}


export async function updateRTDBUserProfileOnLogin(uid: string, details: { displayName?: string | null, photoURL?: string | null }): Promise<{ success: boolean; message?: string }> {
  if (!rtdb) {
    return { success: false, message: "Realtime Database is not configured." };
  }
  try {
    // This function can update details like photoURL or displayName on login if they've changed
    const userRef = ref(rtdb, `users/${uid}`);
    const snapshot = await get(userRef);
    if(snapshot.exists()) {
      const updates: Partial<UserProfile> = {};
      if(details.displayName && details.displayName !== snapshot.val().displayName) {
        updates.displayName = details.displayName;
      }
       if(details.photoURL && details.photoURL !== snapshot.val().photoURL) {
        updates.photoURL = details.photoURL;
      }
      if(Object.keys(updates).length > 0) {
        await update(userRef, updates);
      }
    }
    return { success: true };
  } catch (error: any) {
    console.error('Profile Update Error on Login:', error);
    return { success: false, message: error.message || 'Failed to update user profile in database.' };
  }
}

export async function signOut() {
  try {
    // Firebase signOut is client-side. The actual sign out is handled
    // by onAuthStateChanged in AppContentWrapper and the client-side call in AppSidebarNav.
    // This server action is primarily for a server-initiated redirect if ever needed.
  } catch (error: any) {
    console.error('SignOut Server Action Error (auth.signOut() should be client-side):', error);
  }
  redirect('/login');
}


export async function saveCompanyDetailsToRTDB(details: CompanyDetails): Promise<{ success: boolean; message?: string }> {
    if (!rtdb) {
        return { success: false, message: "Realtime Database is not configured." };
    }
    try {
        const detailsRef = ref(rtdb, 'companyDetails/info');
        await set(detailsRef, details);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to save company details to RTDB:', error);
        return { success: false, message: error.message || 'Failed to save company details.' };
    }
}

export async function getCompanyDetailsFromRTDB(): Promise<{ success: boolean; data?: CompanyDetails; message?: string }> {
    if (!rtdb) {
        return { success: false, message: "Realtime Database is not configured." };
    }
    try {
        const detailsRef = ref(rtdb, 'companyDetails/info');
        const snapshot = await get(detailsRef);
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        }
        return { success: true, data: undefined }; // No data found is not an error
    } catch (error: any) {
        console.error('Failed to get company details from RTDB:', error);
        return { success: false, message: error.message || 'Failed to fetch company details.' };
    }
}


export async function getAllUsersFromRTDB(): Promise<{ success: boolean; data?: UserProfile[]; message?: string }> {
    if (!rtdb) {
        return { success: false, message: "Realtime Database is not configured." };
    }
    try {
        const usersRef = ref(rtdb, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const usersData = snapshot.val();
            // The data is an object with UIDs as keys. Convert it to an array.
            const usersArray = Object.keys(usersData).map(uid => ({
                uid,
                ...usersData[uid]
            }));
            return { success: true, data: usersArray };
        }
        return { success: true, data: [] }; // No users found is not an error
    } catch (error: any) {
        console.error('Failed to get all users from RTDB:', error);
        return { success: false, message: error.message || 'Failed to fetch user profiles.' };
    }
}

export async function updateUserRoleInRTDB(userId: string, role: 'admin' | 'vendor' | 'user', vendorCode?: string): Promise<{ success: boolean; message?: string }> {
    if (!rtdb) {
        return { success: false, message: "Realtime Database is not configured." };
    }
    try {
        const userRef = ref(rtdb, `users/${userId}`);
        const updates: Partial<UserProfile> = { role };
        
        if (role === 'vendor') {
            // If a vendor code is provided, set it. If not, it remains unchanged unless explicitly cleared.
            if(vendorCode) {
                updates.vendorCode = vendorCode;
            }
        } else {
            // If the role is changed to anything other than 'vendor', remove the vendorCode.
            updates.vendorCode = null; // Use null to remove the field in Firebase RTDB
        }

        await update(userRef, updates);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update user role in RTDB:', error);
        return { success: false, message: error.message || 'Failed to update user role.' };
    }
}
