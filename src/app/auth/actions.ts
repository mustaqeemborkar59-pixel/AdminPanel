
"use server";

import { redirect } from 'next/navigation';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteField } from 'firebase/firestore';
import type { UserProfile, CompanyDetails } from '@/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


// Stripped down version for signup, role is handled internally
interface UserProfileOnSignup {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}


// --- Firestore User Profile Actions ---

export async function createUserProfile(details: UserProfileOnSignup): Promise<{ success: boolean; message?: string }> {
  const { firestore } = initializeFirebase();
  try {
    const userRef = doc(firestore, `users/${details.uid}`);
    
    // Check if the signing-up user is the super admin based on the .env file
    const isSuperAdmin = details.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
    
    // Explicitly set the role to 'super-admin' if it is, otherwise default to 'user'
    const userProfile: UserProfile = {
      uid: details.uid,
      email: details.email || 'No email',
      displayName: details.displayName || 'New User',
      photoURL: details.photoURL || '',
      role: isSuperAdmin ? 'super-admin' : 'user', // Set role based on super admin check
    };

    // Use a non-blocking write and handle permission errors
    setDoc(userRef, userProfile, { merge: true }).catch(error => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'create',
            requestResourceData: userProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
    });

    return { success: true };
  } catch (error: any) {
    console.error('Firestore Profile Creation Error on Signup:', error);
    return { success: false, message: error.message || 'Failed to create user profile in database.' };
  }
}

export async function getUserProfile(uid: string): Promise<{ success: boolean; data?: UserProfile; message?: string }> {
    const { firestore } = initializeFirebase();
    try {
        const userRef = doc(firestore, `users/${uid}`);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() as UserProfile };
        }
        return { success: false, message: "User profile not found." };
    } catch (error: any) {
        console.error('Failed to get user profile from Firestore:', error);
        return { success: false, message: error.message || 'Failed to fetch user profile.' };
    }
}

export async function updateUserProfile(uid: string, details: { displayName?: string | null, photoURL?: string | null }): Promise<{ success: boolean; message?: string }> {
  const { firestore } = initializeFirebase();
  try {
    const userRef = doc(firestore, `users/${uid}`);
    const docSnap = await getDoc(userRef);
    if(docSnap.exists()) {
      const updates: Partial<UserProfile> = {};
      if(details.displayName && details.displayName !== docSnap.data().displayName) {
        updates.displayName = details.displayName;
      }
       if(details.photoURL && details.photoURL !== docSnap.data().photoURL) {
        updates.photoURL = details.photoURL;
      }
      if(Object.keys(updates).length > 0) {
        await updateDoc(userRef, updates);
      }
    }
    return { success: true };
  } catch (error: any) {
    console.error('Firestore Profile Update Error on Login:', error);
    return { success: false, message: error.message || 'Failed to update user profile in database.' };
  }
}

export async function getAllUsers(): Promise<{ success: boolean; data?: UserProfile[]; message?: string }> {
    const { firestore } = initializeFirebase();
    try {
        const usersRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersRef);
        const usersArray: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
            usersArray.push(doc.data() as UserProfile);
        });
        return { success: true, data: usersArray };
    } catch (error: any) {
        console.error('Failed to get all users from Firestore:', error);
        return { success: false, message: error.message || 'Failed to fetch user profiles.' };
    }
}

export async function updateUserRole(userId: string, role: 'admin' | 'vendor' | 'user' | 'super-admin', vendorCode?: string): Promise<{ success: boolean; message?: string }> {
    const { firestore } = initializeFirebase();
    try {
        const userRef = doc(firestore, `users/${userId}`);
        const updates: Partial<UserProfile> & {[key: string]: any} = { role };
        
        if (role === 'vendor') {
            if(vendorCode) {
                updates.vendorCode = vendorCode;
            }
        } else {
            // If the role is changed to anything other than 'vendor', remove the vendorCode.
            updates.vendorCode = deleteField(); // Use deleteField() to remove the field in Firestore
        }

        await updateDoc(userRef, updates);
        return { success: true };
    } catch (error: any)
    {
        console.error('Failed to update user role in Firestore:', error);
        return { success: false, message: error.message || 'Failed to update user role.' };
    }
}

// --- Other Actions (SignOut, Company Details) ---

export async function signOut() {
  try {
    // Firebase signOut is client-side. This server action is for server-initiated redirects.
  } catch (error: any) {
    console.error('SignOut Server Action Error:', error);
  }
  redirect('/login');
}

export async function saveCompanyDetailsToRTDB(details: CompanyDetails): Promise<{ success: boolean; message?: string }> {
    // This function still uses RTDB as it's not part of the user profile migration.
    // It can be migrated later if needed.
    const { rtdb } = initializeFirebase();
    if (!rtdb) {
        return { success: false, message: "Realtime Database is not configured." };
    }
    try {
        const { ref, set } = await import('firebase/database');
        const detailsRef = ref(rtdb, 'companyDetails/info');
        await set(detailsRef, details);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to save company details to RTDB:', error);
        return { success: false, message: error.message || 'Failed to save company details.' };
    }
}

export async function getCompanyDetailsFromRTDB(): Promise<{ success: boolean; data?: CompanyDetails; message?: string }> {
    // This function still uses RTDB.
    const { rtdb } = initializeFirebase();
    if (!rtdb) {
        return { success: false, message: "Realtime Database is not configured." };
    }
    try {
        const { ref, get } = await import('firebase/database');
        const detailsRef = ref(rtdb, 'companyDetails/info');
        const snapshot = await get(detailsRef);
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        }
        return { success: true, data: undefined };
    } catch (error: any) {
        console.error('Failed to get company details from RTDB:', error);
        return { success: false, message: error.message || 'Failed to fetch company details.' };
    }
}
