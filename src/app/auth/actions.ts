
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
    // Not throwing error here to let auth flow continue, but logging it.
    // Depending on requirements, you might want to handle this more strictly.
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
        // If profile doesn't exist for some reason, create it.
        updates.createdAt = rtdbServerTimestamp(); // Set createdAt if creating new.
        await rtdbSet(userRefRtdb, updates);
      }
    } catch (error) {
        console.error("Error updating/creating user profile in RTDB on login:", error);
        // Not throwing error here to let auth flow continue.
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
      // This case should ideally not happen if createUserWithEmailAndPassword succeeds.
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
          message = error.message || `Sign up failed. (Code: ${error.code})`;
      }
    } else if (error.message) {
        message = error.message;
    }
    return { success: false, message };
  }
  redirect('/'); // Redirect to dashboard on success
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
      // This case should ideally not happen if signInWithEmailAndPassword succeeds.
      return { success: false, message: 'User sign in failed after credential generation.' };
    }
  } catch (error: any) {
    console.error('SignIn Error:', error);
    let message = 'An unknown error occurred during sign in.';

    if (error.code) {
      switch (error.code) {
        case 'auth/invalid-credential': // Covers user-not-found and wrong-password
          message = 'Invalid email or password. Please try again.';
          break;
        case 'auth/invalid-email':
          message = 'The email address is not valid.';
          break;
        case 'auth/user-disabled':
          message = 'This user account has been disabled.';
          break;
        default:
          message = error.message || `Sign in failed. (Code: ${error.code})`;
      }
    } else if (error.message) {
        message = error.message;
    }
    return { success: false, message };
  }
  redirect('/'); // Redirect to dashboard on success
}

export async function signOut() {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error('SignOut Error:', error);
    // If signout fails, we might still want to redirect or show an error
    // For now, a console error is fine. The redirect below will always happen.
  }
  redirect('/login');
}
