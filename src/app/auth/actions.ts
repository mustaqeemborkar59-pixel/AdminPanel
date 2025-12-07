
"use server";

import { redirect } from 'next/navigation';
import { rtdb } from '@/lib/firebase';
import { ref, set, get } from 'firebase/database';
import type { UserProfile } from '@/types';

interface UserProfileData {
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

// This server action is a wrapper but the core logic is now removed.
// It can be kept for future use or removed if no DB interaction on signup is needed.
export async function createRTDBUserProfileOnSignup(details: UserProfileData): Promise<{ success: boolean; message?: string }> {
  try {
    // Database logic removed
    console.log("User profile creation trigger. No database action taken.");
    return { success: true };
  } catch (error: any) {
    console.error('Profile Creation Error on Signup:', error);
    return { success: false, message: error.message || 'Failed to create user profile in database.' };
  }
}

// This server action is a wrapper but the core logic is now removed.
export async function updateRTDBUserProfileOnLogin(details: UserProfileData): Promise<{ success: boolean; message?: string }> {
  try {
    // Database logic removed
    console.log("User profile update trigger. No database action taken.");
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
