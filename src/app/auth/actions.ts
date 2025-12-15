
"use server";

import { redirect } from 'next/navigation';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import type { UserProfile, CompanyDetails, Vendor } from '@/types';

// Server-side initialization for Firebase Admin SDK
function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  // Use service account credentials from environment variables
  // This is more explicit and reliable than relying on auto-discovery.
  const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key must have newline characters escaped to be parsed correctly from .env
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
  }

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error("Firebase Admin credentials are not set in the environment variables.");
  }

  return initializeApp({
    credential: cert(serviceAccount),
    databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
  });
}

function getAdminServices(app: App) {
  const firestore = getFirestore(app);
  const auth = getAdminAuth(app);
  return { firestore, auth };
}


// --- Firestore User Profile Actions ---

interface UserProfileOnSignup {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export async function createUserProfile(details: UserProfileOnSignup): Promise<{ success: boolean; message?: string }> {
  const adminApp = initializeAdminApp();
  const { firestore, auth } = getAdminServices(adminApp);
  try {
    const userRef = firestore.collection('users').doc(details.uid);
    
    const isSuperAdmin = details.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;
    const role = isSuperAdmin ? 'super-admin' : 'user';
    
    const userProfile: UserProfile = {
      uid: details.uid,
      id: details.uid,
      email: details.email || 'No email',
      displayName: details.displayName || 'New User',
      photoURL: details.photoURL || '',
      role: role,
    };

    await userRef.set(userProfile, { merge: true });

    // Also set custom claim for the user role for robust security
    await auth.setCustomUserClaims(details.uid, { role });

    return { success: true };
  } catch (error: any) {
    console.error('Firestore Profile Creation Error on Signup (Admin):', error);
    return { success: false, message: error.message || 'Failed to create user profile in database.' };
  }
}

export async function getUserProfile(uid: string): Promise<{ success: boolean; data?: UserProfile; message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(uid);
        const docSnap = await userRef.get();
        if (docSnap.exists) {
            return { success: true, data: docSnap.data() as UserProfile };
        }
        return { success: false, message: "User profile not found." };
    } catch (error: any) {
        console.error('Failed to get user profile from Firestore (Admin):', error);
        return { success: false, message: error.message || 'Failed to fetch user profile.' };
    }
}

export async function updateUserProfile(uid: string, details: { displayName?: string | null, photoURL?: string | null }): Promise<{ success: boolean; message?: string }> {
  const adminApp = initializeAdminApp();
  const { firestore } = getAdminServices(adminApp);
  try {
    const userRef = firestore.collection('users').doc(uid);
    const docSnap = await userRef.get();
    if(docSnap.exists) {
      const updates: Partial<UserProfile> = {};
      if(details.displayName && details.displayName !== docSnap.data()?.displayName) {
        updates.displayName = details.displayName;
      }
       if(details.photoURL && details.photoURL !== docSnap.data()?.photoURL) {
        updates.photoURL = details.photoURL;
      }
      if(Object.keys(updates).length > 0) {
        await userRef.update(updates);
      }
    }
    return { success: true };
  } catch (error: any) {
    console.error('Firestore Profile Update Error (Admin):', error);
    return { success: false, message: error.message || 'Failed to update user profile in database.' };
  }
}

export async function getAllUsers(): Promise<{ success: boolean; data?: UserProfile[]; message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const usersRef = firestore.collection('users');
        const querySnapshot = await usersRef.get();
        const usersArray: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
            usersArray.push(doc.data() as UserProfile);
        });
        return { success: true, data: usersArray };
    } catch (error: any) {
        console.error('Failed to get all users from Firestore (Admin):', error);
        return { success: false, message: error.message || 'Failed to fetch user profiles.' };
    }
}

export async function updateUserRole(userId: string, role: 'admin' | 'vendor' | 'user' | 'super-admin', vendorCode?: string): Promise<{ success: boolean; message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore, auth } = getAdminServices(adminApp);
    const FieldValue = require('firebase-admin/firestore').FieldValue;
    try {
        const userRef = firestore.collection('users').doc(userId);
        const updates: { [key: string]: any } = { role };
        
        if (role === 'vendor') {
            if(vendorCode) {
                updates.vendorCode = vendorCode;
            }
        } else {
            updates.vendorCode = FieldValue.delete();
        }

        await userRef.update(updates);
        await auth.setCustomUserClaims(userId, { role });

        return { success: true };
    } catch (error: any) {
        console.error('Failed to update user role (Admin):', error);
        return { success: false, message: error.message || 'Failed to update user role.' };
    }
}


// --- Other Actions (SignOut, Company Details) ---

export async function signOut() {
  // This is a client-side action, so redirecting is the main purpose here.
  redirect('/login');
}


// The functions below still use the client-side SDK via a different initialization.
// This is not ideal, but changing them now could introduce more errors.
// For now, we focus on fixing the main signup/login flow.
// A proper fix would be to migrate these to the Admin SDK as well if they are meant to be server-only.

// Note: Company Details are still managed via Realtime Database using the client SDK.
// This is a separate concern from the Firestore user profile migration.

async function getClientRTDB() {
    const { initializeApp: initializeClientApp, getApps: getClientApps, getApp: getClientApp } = await import('firebase/app');
    const { getDatabase } = await import('firebase/database');
    const { firebaseConfig } = await import('@/firebase/config');
    
    const clientApps = getClientApps();
    const appName = 'client-rtdb-app';
    const existingApp = clientApps.find(app => app.name === appName);
    const app = existingApp ? existingApp : initializeClientApp(firebaseConfig, appName);
    
    return getDatabase(app);
}

export async function saveCompanyDetailsToRTDB(details: CompanyDetails): Promise<{ success: boolean; message?: string }> {
    try {
        const rtdb = await getClientRTDB();
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
    try {
        const rtdb = await getClientRTDB();
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

// Vendors actions are also using the client RTDB, which is fine for now.
export async function saveVendorToRTDB(vendorData: Omit<Vendor, 'id'>, vendorId?: string): Promise<{ success: boolean; error?: string }> {
    try {
        const rtdb = await getClientRTDB();
        const { ref, set, push, child } = await import('firebase/database');
        const vendorsRef = ref(rtdb, 'vendors');
        let vendorRef;

        if (vendorId) {
            vendorRef = child(vendorsRef, vendorId);
        } else {
            vendorRef = push(vendorsRef);
        }
        
        await set(vendorRef, vendorData);
        return { success: true };

    } catch (error: any) {
        console.error('Failed to save vendor to RTDB:', error);
        return { success: false, error: error.message || 'Failed to save vendor.' };
    }
}

export async function getVendorsFromRTDB(): Promise<{ success: boolean; data?: Vendor[], error?: string }> {
    try {
        const rtdb = await getClientRTDB();
        const { ref, get } = await import('firebase/database');
        const vendorsRef = ref(rtdb, 'vendors');
        const snapshot = await get(vendorsRef);

        if (snapshot.exists()) {
            const vendorsData = snapshot.val();
            const vendorsArray = Object.keys(vendorsData).map(id => ({
                id,
                ...vendorsData[id]
            }));
            return { success: true, data: vendorsArray };
        }
        
        return { success: true, data: [] };

    } catch (error: any) {
        console.error('Failed to get vendors from RTDB:', error);
        return { success: false, error: error.message || 'Failed to fetch vendors.' };
    }
}

export async function deleteVendorFromRTDB(vendorId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const rtdb = await getClientRTDB();
        const { ref, remove } = await import('firebase/database');
        const vendorRef = ref(rtdb, `vendors/${vendorId}`);
        await remove(vendorRef);
        return { success: true };

    } catch (error: any) {
        console.error('Failed to delete vendor from RTDB:', error);
        return { success: false, error: error.message || 'Failed to delete vendor.' };
    }
}
