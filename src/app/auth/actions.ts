
"use server";

import { redirect } from 'next/navigation';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database'; // Using Admin SDK for RTDB
import type { UserProfile, CompanyDetails, Vendor } from '@/types';

// Server-side initialization for Firebase Admin SDK
function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const serviceAccount = {
      type: "service_account",
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }

  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
      throw new Error("Firebase Admin credentials are not set correctly in the environment variables.");
  }

  return initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });
}

function getAdminServices(app: App) {
  const firestore = getFirestore(app);
  const auth = getAdminAuth(app);
  const rtdb = getDatabase(app); // Get RTDB instance from Admin SDK
  return { firestore, auth, rtdb };
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
  redirect('/login');
}


// --- RTDB Actions using Admin SDK ---

export async function saveCompanyDetailsToRTDB(details: CompanyDetails): Promise<{ success: boolean; message?: string }> {
    const adminApp = initializeAdminApp();
    const { rtdb } = getAdminServices(adminApp);
    try {
        const detailsRef = rtdb.ref('companyDetails/info');
        await detailsRef.set(details);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to save company details to RTDB (Admin):', error);
        return { success: false, message: error.message || 'Failed to save company details.' };
    }
}

export async function getCompanyDetailsFromRTDB(): Promise<{ success: boolean; data?: CompanyDetails; message?: string }> {
    const adminApp = initializeAdminApp();
    const { rtdb } = getAdminServices(adminApp);
    try {
        const detailsRef = rtdb.ref('companyDetails/info');
        const snapshot = await detailsRef.once('value');
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        }
        return { success: true, data: undefined };
    } catch (error: any) {
        console.error('Failed to get company details from RTDB (Admin):', error);
        return { success: false, message: error.message || 'Failed to fetch company details.' };
    }
}

export async function saveVendorToRTDB(vendorData: Omit<Vendor, 'id'>, vendorId?: string): Promise<{ success: boolean; error?: string }> {
    const adminApp = initializeAdminApp();
    const { rtdb } = getAdminServices(adminApp);
    try {
        const vendorsRef = rtdb.ref('vendors');
        let vendorRef;

        if (vendorId) {
            vendorRef = vendorsRef.child(vendorId);
        } else {
            vendorRef = vendorsRef.push();
        }
        
        await vendorRef.set(vendorData);
        return { success: true };

    } catch (error: any) {
        console.error('Failed to save vendor to RTDB (Admin):', error);
        return { success: false, error: error.message || 'Failed to save vendor.' };
    }
}

export async function getVendorsFromRTDB(): Promise<{ success: boolean; data?: Vendor[], error?: string }> {
    const adminApp = initializeAdminApp();
    const { rtdb } = getAdminServices(adminApp);
    try {
        const vendorsRef = rtdb.ref('vendors');
        const snapshot = await vendorsRef.once('value');

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
        console.error('Failed to get vendors from RTDB (Admin):', error);
        return { success: false, error: error.message || 'Failed to fetch vendors.' };
    }
}

export async function deleteVendorFromRTDB(vendorId: string): Promise<{ success: boolean; error?: string }> {
    const adminApp = initializeAdminApp();
    const { rtdb } = getAdminServices(adminApp);
    try {
        const vendorRef = rtdb.ref(`vendors/${vendorId}`);
        await vendorRef.remove();
        return { success: true };

    } catch (error: any) {
        console.error('Failed to delete vendor from RTDB (Admin):', error);
        return { success: false, error: error.message || 'Failed to delete vendor.' };
    }
}
