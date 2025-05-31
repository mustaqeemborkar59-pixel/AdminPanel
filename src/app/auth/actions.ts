
"use server";

import { redirect } from 'next/navigation';
import { auth, rtdb } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User
} from 'firebase/auth';
import { ref as rtdbRef, set as rtdbSet, update as rtdbUpdate, serverTimestamp as rtdbServerTimestamp, get as rtdbGet } from 'firebase/database';

export interface AuthFormState {
  success: boolean;
  message: string;
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
    throw new Error("Failed to create user profile in database.");
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
        email: user.email, 
        uid: user.uid,
      };

      const snapshot = await rtdbGet(userRefRtdb);
      if (snapshot.exists()) {
        await rtdbUpdate(userRefRtdb, updates);
      } else {
        updates.createdAt = rtdbServerTimestamp();
        await rtdbSet(userRefRtdb, updates);
      }
    } catch (error) {
        console.error("Error updating/creating user profile in RTDB on login:", error);
        throw new Error("Failed to update user profile in database.");
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
    } else {
      return { success: false, message: 'User creation failed after credential generation.' };
    }
  } catch (error: any) {
    console.error('SignUp Error:', error);
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
          message = `Sign up failed: ${error.message || 'Please try again.'} (Code: ${error.code})`;
      }
    } else if (error.message) {
       if (error.message && !error.message.includes('NEXT_REDIRECT')) {
        message = `Sign up failed: ${error.message}`;
      } else if (error.message && error.message.includes('NEXT_REDIRECT')) {
         console.warn("Caught NEXT_REDIRECT like error unexpectedly in catch block for signup: ", error.message);
         message = "An unexpected issue occurred during sign up. Please try again.";
      }
    }
    return { success: false, message };
  }
  redirect('/?signup_success=true'); 
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
    } else {
      return { success: false, message: 'User sign in failed after credential generation.' };
    }
  } catch (error: any) {
    console.error('SignIn Error:', error);
    let message = 'An unknown error occurred during sign in.';

    if (error.code) {
      switch (error.code) {
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
          message = `Sign in failed: ${error.message || 'Please try again.'} (Code: ${error.code})`;
      }
    } else if (error.message) {
      if (error.message && !error.message.includes('NEXT_REDIRECT')) {
        message = `Sign in failed: ${error.message}`;
      } else if (error.message && error.message.includes('NEXT_REDIRECT')) {
         console.warn("Caught NEXT_REDIRECT like error unexpectedly in catch block for signin: ", error.message);
         message = "An unexpected issue occurred during sign in. Please try again.";
      }
    }
    return { success: false, message };
  }
  redirect('/?login_success=true');
}

export async function signOut() {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error('SignOut Error:', error);
  }
  redirect('/login');
}
