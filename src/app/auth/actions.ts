// src/app/auth/actions.ts
"use server";

import { redirect } from 'next/navigation';
import { auth, rtdb } from '@/lib/firebase'; // Import rtdb
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  type UserCredential,
  type User
} from 'firebase/auth';
import { ref as rtdbRef, set as rtdbSet, serverTimestamp as rtdbServerTimestamp } from 'firebase/database'; // RTDB functions

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
    // Decide if this error should prevent login/signup or just be logged
  }
}

async function updateUserProfileOnLoginInRTDB(user: User) {
    if (!user) return;
    const userRefRtdb = rtdbRef(rtdb, 'users/' + user.uid);
    try {
      // Using set to create or overwrite, ensuring all fields are present
      // For RTDB, to "merge", you'd typically fetch then update, or structure data to allow partial updates easily.
      // Here, we'll just set the essentials, including updating lastLoginAt.
      // If a more nuanced merge is needed, the logic would be more complex.
      await rtdbSet(userRefRtdb, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || `https://placehold.co/100x100.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`,
        // Keep createdAt if it exists, otherwise set it. This is tricky with RTDB's set, might need to fetch first.
        // For simplicity, if we always call this on login, createdAt might be overwritten if not handled.
        // A better approach might be separate create and update functions or using rtdb.update for specific fields.
        // For now, we'll re-set createdAt if we're setting the whole object.
        // If you only want to update lastLoginAt: `rtdbSet(rtdbRef(rtdb, 'users/' + user.uid + '/lastLoginAt'), rtdbServerTimestamp());`
        createdAt: rtdbServerTimestamp(), // This would overwrite if we don't fetch first
        lastLoginAt: rtdbServerTimestamp(),
      });
      // More robust:
      // const userProfileSnapshot = await get(userRefRtdb);
      // const updates: any = { lastLoginAt: rtdbServerTimestamp() };
      // if (!userProfileSnapshot.exists() || !userProfileSnapshot.val()?.createdAt) {
      //   updates.createdAt = rtdbServerTimestamp();
      //   updates.uid = user.uid;
      //   updates.email = user.email;
      //   // ... other fields for new profile
      // }
      // await rtdbUpdate(userRefRtdb, updates);


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
      redirect('/'); // Redirect to dashboard
      // Note: redirect() throws an error that Next.js catches to perform the redirect.
      // So, code below redirect() in the try block might not execute.
      // The return statement below is effectively for type matching if redirect doesn't happen or for non-redirect scenarios.
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
      await updateUserProfileOnLoginInRTDB(userCredential.user); // Changed to update RTDB profile
      redirect('/'); // Redirect to dashboard
      // For type matching if redirect doesn't happen or for non-redirect scenarios.
      return { success: true, message: 'Login successful! Redirecting...', redirectUrl: '/', userId: userCredential.user.uid };
    }
    return { success: false, message: 'User sign in failed after credential generation.' };
  } catch (error: any) {
    let message = 'An unknown error occurred during sign in.';
    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential': // This covers both wrong email/password
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
    // For type matching if redirect doesn't happen or for non-redirect scenarios.
    // return { success: true, message: 'Signed out successfully.', redirectUrl: '/login' }; 
  } catch (error: any) {
    console.error('SignOut Error:', error);
    // return { success: false, message: `Sign out failed: ${error.message}` };
  }
}
