
"use server";

import { redirect } from 'next/navigation';
import { getFirestore, Timestamp, FieldValue as AdminFieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import type { UserProfile, CompanyDetails, Vendor } from '@/types';
import type { SubscriptionPlan } from '@/app/usage/page';


// Server-side initialization for Firebase Admin SDK
function initializeAdminApp(): App {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  // Fallback to environment variables if service account JSON isn't directly available
  // This is a common pattern for Vercel, Netlify, etc.
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : {
        "type": "service_account",
        "project_id": "sheetmaster-woo4-3652307-f6517",
        "private_key_id": "a0db644cb948706d89c40d6f98654459a2681c49",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDSavxwFm0FlZS1\nX133N6x1bxIGgSKj+xKs9z/CdApPxqR1lxNWxkM/r6za7XOsLADZ40+0p+KVAc6w\nSIAShJyZlxDNyEpFQNK7IUKgcg/hB+DPZrifyHXQ+32f22+v/7+Hy3HAkY9mKI1x\nTg3nZcVgKP9LnogV1EtD2b7rj6f9UbfOzOcpDGUJS4DhUMvoXEmCiczaq84pDjyL\nOJx3aNOfEtlexEISIuCU+FCOIp7s18C1Xcd81KqMh3V2WSaZ3gkcozCR5w95D4Gl\nN02OocXasmJsjEhGstV6bAkcmSLTdGF47OM2lGUcC1u7NMDj/1XYAXk3mVargL6r\njrcy+upJAgMBAAECggEAL86S8DyIJJ6pnNPAG60Qh9XmeIfagPtIcPf0CpAmz51I\nPFdI04xUNyII2ezdPR76Sob00wzZ1BUHCtJOFub+VX8XGEoLZdSmjFGwO5fut6f8\nkeK6y8LV0ddx4WIP7CLlN0sn2yK3O/S2vimHyy06PPDToDCyppMHTrEoSYjoGAuR\na+2AkePutu60iasWXQCkT4kj0PejSAMVmrrqRRwkmqRXfJ9M5XTgrDNEha5o6wgv\nxr3ZoQk6qQp+7OPGSXksk+zdg/P8MbnyYQsVNV5xz7Ls6UziBpUb2o5q5RbzYsmJ\nlZ6grNoIIX8wexCuuL2bUMdLjS5gCcvF/SnS1GOfqQKBgQDzaVM1pC/d4X3Yg51m\nSnZG2l7L6DMmJPQ3snXUSJImyJJ7kjIAmcCJHuVNQkhE2RpdWl+B8AGRDks81P+c\nqJWbM/hMjhvkH7Yv4aQ90kQrnJxPbSxWHWTZxNbyyrC7upXLI2zs/b/6DiRrOXjP\nC9s2bTDjnekYK6IwVu6e1l6pIwKBgQDdTNbnaVgq8/6QHimuuAOgyvDwD+FbGgiF\n96ocQUvmdFlWLu9G2xML5dQBmFg6EuVC6fl8WGgHQ59a7FUeBPXwCf8lDt/VHXs4\nv6nsagSyGoTakSw94yxP9aNMPrBhbZRXsrccbufup9uO6pcEso1XY+SOgj0iiog3\nu1aLckPzowKBgCTxuIJswCMiJXKmT06GQLtyS28ReCny8+o8OOwWc7BVQv5kaxhy\nPanSOaVnSQbCGOFQZSyYm/RDQiIihgVmBQcAdVBRRWRzd7h+u+nyLwybgZIAlPkh\nDvyKhsFlCDwGDtQ9NTwnK2stmFN57p8mQohZPFFf11Am10AVAbSz/rwXAoGANJbM\nAxYfo6Vz+x+P3DtScWWIuCOt9A5NtDhUrn494TgI+tgQeJAbCJrHNNHVNYfD/5DG\nfuwrXH6PYfYDjCy1nSNjBJVyT5y/6Y5yfQH8t65hn+cb0mEn6KCA+99x3tVBiU2p\nAhLA/w/Yty+8T5t2xyuv5sXAbXLqSAQ23tB6oW0CgYAtzTtjUCuy7k2uW/AdwVh4\nEKQHI11frMgCZrNBvKx/YLGkfP0uHhkykvUPY+GaaB1VWbDZjOK2raJ4V8pR9WAC\n3LJF5/tHZXfuq+Rd8w1YezPpEbC+aGUFV4z/W6SIaQLeUlB2HRFzG8h1t6Okn3m8\nsrWMg0vW515DTuUJfEr6AQ==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-fbsvc@sheetmaster-woo4-3652307-f6517.iam.gserviceaccount.com",
        "client_id": "109409820100882232028",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sheetmaster-woo4-3652307-f6517.iam.gserviceaccount.com"
      };

  return initializeApp({
    credential: cert(serviceAccount),
    databaseURL: "https://sheetmaster-woo4-3652307-f6517-default-rtdb.firebaseio.com"
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
