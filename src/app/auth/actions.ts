
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
    // Re-throw to be caught by the calling action's catch block
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
        email: user.email, // Keep email updated if it changes (though unlikely via this flow)
        uid: user.uid, // Ensure UID is present
      };

      const snapshot = await rtdbGet(userRefRtdb);
      if (snapshot.exists()) {
        // Profile exists, update it
        await rtdbUpdate(userRefRtdb, updates);
      } else {
        // Profile doesn't exist, create it fully (including createdAt)
        updates.createdAt = rtdbServerTimestamp();
        await rtdbSet(userRefRtdb, updates);
      }
    } catch (error) {
        console.error("Error updating/creating user profile in RTDB on login:", error);
        // Re-throw to be caught by the calling action's catch block
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
      // Do not redirect from inside the try block
    } else {
      // This state is unlikely if createUserWithEmailAndPassword throws an error on failure
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
      message = `Sign up failed: ${error.message}`;
    }
    return { success: false, message };
  }

  // If all operations in the try block succeeded, redirect.
  redirect('/');
  // Note: The function execution stops here because redirect() throws an error.
  // No AuthFormState is returned to the client in this success case.
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
      // Do not redirect from inside the try block
    } else {
      // This state is unlikely if signInWithEmailAndPassword throws an error on failure
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
      // Avoid showing "NEXT_REDIRECT" as the error message here.
      // If it's a generic error after all Firebase ops, it might be from a re-thrown DB error.
      if (error.message && !error.message.includes('NEXT_REDIRECT')) {
        message = `Sign in failed: ${error.message}`;
      } else if (error.message && error.message.includes('NEXT_REDIRECT')) {
         // This case should ideally not be hit if redirect() is outside the try-catch.
         // If it is, it means something else is throwing a redirect-like error.
         console.warn("Caught NEXT_REDIRECT like error unexpectedly in catch block: ", error.message);
         message = "An unexpected issue occurred during sign in. Please try again.";
      }
    }
    return { success: false, message };
  }

  // If all operations in the try block succeeded, redirect.
  redirect('/');
  // Note: The function execution stops here because redirect() throws an error.
  // No AuthFormState is returned to the client in this success case.
}

export async function signOut() {
  try {
    await auth.signOut();
  } catch (error: any) {
    console.error('SignOut Error:', error);
    // Even if Firebase signout fails, attempt to redirect to login.
    // Or, you could return an error state for the client to handle.
    // For simplicity, we'll still try to redirect.
  }
  redirect('/login');
}
