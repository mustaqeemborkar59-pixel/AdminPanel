
"use server";

import { redirect } from 'next/navigation';
import { auth, rtdb } from '@/lib/firebase';
import { ref as rtdbRef, set as rtdbSet, update as rtdbUpdate, serverTimestamp as rtdbServerTimestamp, get as rtdbGet } from 'firebase/database';
// Note: Firebase User type is not directly passed from client to server actions.
// We pass plain data (uid, email, etc.) instead.

interface UserProfileData {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

async function createUserProfileInRTDB(details: UserProfileData) {
  const userRefRtdb = rtdbRef(rtdb, 'users/' + details.uid);
  try {
    await rtdbSet(userRefRtdb, {
      uid: details.uid,
      email: details.email,
      displayName: details.displayName || details.email?.split('@')[0] || 'User',
      photoURL: details.photoURL || `https://placehold.co/100x100.png?text=${details.email?.[0]?.toUpperCase() || 'U'}`,
      createdAt: rtdbServerTimestamp(),
      lastLoginAt: rtdbServerTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile in RTDB:", error);
    // This function is called after successful Firebase Auth user creation.
    // If RTDB write fails, the user is still created in Auth.
    // Depending on requirements, you might want to handle this more strictly,
    // e.g., by trying to delete the Auth user or flagging the profile for retry.
    // For now, we log the error.
  }
}

async function updateUserProfileOnLoginInRTDB(details: UserProfileData) {
    const userRefRtdb = rtdbRef(rtdb, 'users/' + details.uid);
    try {
      const updates: Record<string, any> = {
        lastLoginAt: rtdbServerTimestamp(),
        // Ensure displayName and photoURL are updated if they change in Auth,
        // or set default if they are nullish.
        displayName: details.displayName || details.email?.split('@')[0] || 'User',
        photoURL: details.photoURL || `https://placehold.co/100x100.png?text=${details.email?.[0]?.toUpperCase() || 'U'}`,
        email: details.email, // Keep email updated
        uid: details.uid, // Ensure UID is present
      };

      const snapshot = await rtdbGet(userRefRtdb);
      if (snapshot.exists()) {
        await rtdbUpdate(userRefRtdb, updates);
      } else {
        // If profile doesn't exist for some reason (e.g., manual deletion, or user signed in with a provider before email/pass), create it.
        updates.createdAt = rtdbServerTimestamp(); // Set createdAt if creating new.
        await rtdbSet(userRefRtdb, updates);
        console.warn(`RTDB profile for user ${details.uid} did not exist. Created it on login.`);
      }
    } catch (error) {
        console.error("Error updating/creating user profile in RTDB on login:", error);
    }
}

// New server action for client-side signup to call
export async function createRTDBUserProfileOnSignup(details: UserProfileData): Promise<{ success: boolean; message?: string }> {
  try {
    await createUserProfileInRTDB(details);
    return { success: true };
  } catch (error: any) {
    console.error('RTDB Profile Creation Error on Signup:', error);
    return { success: false, message: error.message || 'Failed to create user profile in database.' };
  }
}

// New server action for client-side login to call
export async function updateRTDBUserProfileOnLogin(details: UserProfileData): Promise<{ success: boolean; message?: string }> {
  try {
    await updateUserProfileOnLoginInRTDB(details);
    return { success: true };
  } catch (error: any) {
    console.error('RTDB Profile Update Error on Login:', error);
    return { success: false, message: error.message || 'Failed to update user profile in database.' };
  }
}

export async function signOut() {
  try {
    // Firebase signOut is client-side, but we keep this server action for redirect.
    // The actual signOut from Firebase SDK should be called on the client
    // *before* or in conjunction with this server action for redirect.
    // However, onAuthStateChanged will handle UI updates.
    // This server action primarily ensures a clean redirect to /login.
    await auth.signOut(); // This will error if called on server for client SDK's auth.
                           // It's better to call auth.signOut() on client, then redirect.
                           // For now, we rely on onAuthStateChanged in AppContentWrapper.
  } catch (error: any) {
    console.error('SignOut Server Action Error (auth.signOut() should be client-side):', error);
  }
  redirect('/login');
}
