
"use server";

import { redirect } from 'next/navigation';
import { auth, rtdb } from '@/lib/firebase'; // Import rtdb
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth';
import { ref as rtdbRef, set as rtdbSet, update as rtdbUpdate, serverTimestamp as rtdbServerTimestamp, get as rtdbGet } from 'firebase/database'; // RTDB functions, added update and get

export interface AuthFormState {
  success: boolean;
  message: string;
  redirectUrl?: string;
  userId?: string;
}

async function createUserProfileInRTDB(user: User) {
  if (!user) return;
  const userRefRtdb = rtdbRef(rtdb, 'users/' + user.uid);
  try {
    await rtdbSet(userRefRtdb, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`,
      createdAt: rtdbServerTimestamp(),
      lastLoginAt: rtdbServerTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile in RTDB:", error);
  }
}

async function updateUserProfileOnLoginInRTDB(user: User) {
    if (!user) return;
    const userRefRtdb = rtdbRef(rtdb, 'users/' + user.uid);
    try {
      const updates: Record<string, any> = {
        lastLoginAt: rtdbServerTimestamp(),
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`,
        email: user.email, // Keep email field updated if it can change via Firebase Auth profile
        uid: user.uid, // Ensure uid is present
      };

      // Check if profile exists to decide whether to create it fully or just update
      const snapshot = await rtdbGet(userRefRtdb);
      if (snapshot.exists()) {
        // Profile exists, just update mutable fields
        await rtdbUpdate(userRefRtdb, updates);
      } else {
        // Profile doesn't exist (edge case, e.g., auth user without RTDB profile), create it fully
        updates.createdAt = rtdbServerTimestamp(); // Set createdAt as this is effectively an initial creation in RTDB
        await rtdbSet(userRefRtdb, updates);
      }
    } catch (error) {
        console.error("Error updating user profile in RTDB on login:", error);
    }
}


export async function signUpWithEmailPassword(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password || !confirmPassword) {
    return { success: false, message: 'Email, password, and confirm password are required.' };
  }
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters long.' };
  }
  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match.' };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await createUserProfileInRTDB(userCredential.user);
      redirect('/'); 
      return { success: true, message: 'Signup successful! Redirecting...', redirectUrl: '/', userId: userCredential.user.uid };
    }
    return { success: false, message: 'User creation failed after credential generation.' };
  } catch (error: any) {
    let message = 'An unknown error occurred during sign up.';
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already in use. Please try a different email or log in.';
          break;
        case 'auth/weak-password':
          message = 'The password is too weak. Please choose a stronger password.';
          break;
        case 'auth/invalid-email':
          message = 'The email address is not valid.';
          break;
        default:
          message = `Sign up failed: ${error.message} (Code: ${error.code})`;
      }
    }
    console.error('SignUp Error:', error);
    return { success: false, message };
  }
}

export async function signInWithEmailPassword(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateUserProfileOnLoginInRTDB(userCredential.user); 
      redirect('/'); 
      return { success: true, message: 'Login successful! Redirecting...', redirectUrl: '/', userId: userCredential.user.uid };
    }
    return { success: false, message: 'User sign in failed after credential generation.' };
  } catch (error: any) {
    let message = 'An unknown error occurred during sign in.';
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential': 
          message = 'Invalid email or password. Please try again.';
          break;
        case 'auth/invalid-email':
          message = 'The email address is not valid.';
          break;
        case 'auth/user-disabled':
          message = 'This user account has been disabled.';
          break;
        default:
          message = `Sign in failed: ${error.message} (Code: ${error.code})`;
      }
    }
    console.error('SignIn Error:', error);
    return { success: false, message };
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    redirect('/login');
  } catch (error: any) {
    console.error('SignOut Error:', error);
  }
}
