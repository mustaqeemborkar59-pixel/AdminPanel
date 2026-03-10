
"use server";

import { redirect } from 'next/navigation';
import { getFirestore, Timestamp, FieldValue as AdminFieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import type { UserProfile, CompanyDetails, Vendor } from '@/types';
import type { SubscriptionPlan } from '@/app/usage/page';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


// Server-side initialization for Firebase Admin SDK
function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  // Construct the service account object from environment variables
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Replace the escaped newlines in the private key
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error('Firebase Admin SDK environment variables are not set correctly.');
  }

  return initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  });
}

function getAdminServices(app: App) {
  const firestore = getFirestore(app);
  const auth = getAdminAuth(app);
  const rtdb = getDatabase(app);
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
      status: 'active', // Set default status to active
      subscriptionStartDate: new Date().toISOString(), // Set subscription start date on creation
      trialUsed: false, // Initialize trialUsed as false for new users
      activePlanId: 'trial', // Default active plan is trial
      canUpdateOrderStatus: false, // Default permission is false
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
  const { firestore, auth } = getAdminServices(adminApp);
  try {
    const userRef = firestore.collection('users').doc(uid);
    const updates: Partial<UserProfile> = {};
    if (details.displayName) {
        updates.displayName = details.displayName;
    }
    if (details.photoURL) {
        updates.photoURL = details.photoURL;
    }

    if (Object.keys(updates).length > 0) {
        await userRef.update(updates);
        // Also update the auth user display name if it's being changed
        if (updates.displayName) {
            await auth.updateUser(uid, { displayName: updates.displayName });
        }
    }
    return { success: true };
  } catch (error: any) {
    console.error('Firestore Profile Update Error (Admin):', error);
    return { success: false, message: error.message || 'Failed to update user profile.' };
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
    const FieldValue = AdminFieldValue;
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

export async function updateUserPermission(userId: string, canUpdate: boolean): Promise<{ success: boolean; message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({ canUpdateOrderStatus: canUpdate });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update user permission (Admin):', error);
        return { success: false, message: error.message || 'Failed to update permission.' };
    }
}


export async function updateUserStatus(userId: string, status: 'active' | 'blocked'): Promise<{ success: boolean, message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore, auth } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(userId);
        const isBlocked = status === 'blocked';

        // Update Firebase Auth user state
        await auth.updateUser(userId, { disabled: isBlocked });

        // Update Firestore user state
        await userRef.update({ status: status });

        return { success: true };
    } catch (error: any) {
        console.error('Failed to update user status (Admin):', error);
        return { success: false, message: error.message || 'Failed to update user status.' };
    }
}

// --- Company Details Actions ---

export async function getCompanyDetailsFromFirestore(): Promise<{ success: boolean; data?: CompanyDetails; message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const detailsRef = firestore.collection('companyDetails').doc('info');
        const docSnap = await detailsRef.get();
        if (docSnap.exists) {
            return { success: true, data: docSnap.data() as CompanyDetails };
        }
        return { success: true, data: undefined };
    } catch (error: any) {
        console.error('Failed to get company details from Firestore (Admin):', error);
        return { success: false, message: error.message || 'Failed to fetch company details.' };
    }
}

export async function saveCompanyDetailsToFirestore(details: CompanyDetails): Promise<{ success: boolean; message?: string }> {
  const adminApp = initializeAdminApp();
  const { firestore } = getAdminServices(adminApp);
  const detailsRef = firestore.collection('companyDetails').doc('info');

  return detailsRef.set(details, { merge: true })
    .then(() => ({ success: true }))
    .catch((error) => {
      console.error('Firestore Save Error (Admin - Company Details):', error);
      
      const permissionError = new FirestorePermissionError({
        path: detailsRef.path,
        operation: 'write', // 'set' with 'merge:true' can be create or update
        requestResourceData: details,
      });

      // We can't emit from a server component directly, but we can return the structured error
      // For now, let's just return a generic message. The proper fix would be to do this client-side.
      return { success: false, message: permissionError.message || 'Failed to save company details due to a permission issue.' };
    });
}


// --- Firestore Vendor Actions ---

export async function saveVendorToFirestore(vendorData: Omit<Vendor, 'id'>, vendorId?: string): Promise<{ success: boolean; error?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        let vendorRef;
        if (vendorId) {
            vendorRef = firestore.collection('vendors').doc(vendorId);
            await vendorRef.update(vendorData);
        } else {
            vendorRef = firestore.collection('vendors').doc();
            await vendorRef.set({ ...vendorData, id: vendorRef.id });
        }
        return { success: true };
    } catch (error: any) {
        console.error('Failed to save vendor to Firestore (Admin):', error);
        return { success: false, error: error.message || 'Failed to save vendor.' };
    }
}

export async function getVendorsFromFirestore(): Promise<{ success: boolean; data?: Vendor[], error?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const vendorsRef = firestore.collection('vendors');
        const snapshot = await vendorsRef.get();

        if (!snapshot.empty) {
            const vendorsArray = snapshot.docs.map(doc => doc.data() as Vendor);
            return { success: true, data: vendorsArray };
        }
        
        return { success: true, data: [] };

    } catch (error: any) {
        console.error('Failed to get vendors from Firestore (Admin):', error);
        return { success: false, error: error.message || 'Failed to fetch vendors.' };
    }
}

export async function deleteVendorFromFirestore(vendorId: string): Promise<{ success: boolean; error?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const vendorRef = firestore.collection('vendors').doc(vendorId);
        await vendorRef.delete();
        return { success: true };

    } catch (error: any) {
        console.error('Failed to delete vendor from Firestore (Admin):', error);
        return { success: false, error: error.message || 'Failed to delete vendor.' };
    }
}


// --- Subscription Plan Actions ---

export async function getSubscriptionPlans(): Promise<{ success: boolean; data?: SubscriptionPlan[]; error?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const plansRef = firestore.collection('subscriptionPlans');
        const snapshot = await plansRef.get();
        if (snapshot.empty) {
            return { success: true, data: [] };
        }
        const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubscriptionPlan));
        return { success: true, data: plans };
    } catch (error: any) {
        console.error('Failed to get subscription plans from Firestore (Admin):', error);
        return { success: false, error: error.message || 'Failed to fetch subscription plans.' };
    }
}

export async function saveSubscriptionPlan(planData: Omit<SubscriptionPlan, 'id'>, planId?: string): Promise<{ success: boolean; id: string | null; error?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        let planRef;
        if (planId) {
            planRef = firestore.collection('subscriptionPlans').doc(planId);
            await planRef.set(planData, { merge: true });
        } else {
            planRef = firestore.collection('subscriptionPlans').doc();
            await planRef.set({ ...planData, id: planRef.id });
        }
        return { success: true, id: planRef.id };
    } catch (error: any) {
        console.error('Failed to save subscription plan to Firestore (Admin):', error);
        return { success: false, id: null, error: error.message || 'Failed to save subscription plan.' };
    }
}


export async function deleteSubscriptionPlan(planId: string): Promise<{ success: boolean; error?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const planRef = firestore.collection('subscriptionPlans').doc(planId);
        await planRef.delete();
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete subscription plan from Firestore (Admin):', error);
        return { success: false, error: error.message || 'Failed to delete subscription plan.' };
    }
}


export async function updateUserTrialStatus(userId: string, trialUsed: boolean): Promise<{ success: boolean; message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(userId);
        await userRef.update({ trialUsed: trialUsed });
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update user trial status (Admin):', error);
        return { success: false, message: error.message || 'Failed to update trial status.' };
    }
}

export async function updateUserActivePlan(userId: string, planId: string): Promise<{ success: boolean; message?: string }> {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(userId);
        
        const userSnap = await userRef.get();
        const userData = userSnap.data();
        
        const updates: { [key: string]: any } = { 
            activePlanId: planId,
            subscriptionStartDate: new Date().toISOString(), // Reset subscription start date
        };

        if (userData?.activePlanId === 'trial' && planId !== 'trial') {
            updates.trialUsed = true;
        }

        await userRef.update(updates);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update user active plan (Admin):', error);
        return { success: false, message: error.message || 'Failed to update active plan.' };
    }
}

    

    

    
