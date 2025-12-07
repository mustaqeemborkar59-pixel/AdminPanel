
"use server";

import { redirect } from 'next/navigation';

interface UserProfileData {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
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
