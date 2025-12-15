
"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, browserLocalPersistence, setPersistence, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { createRTDBUserProfileOnSignup } from '@/app/auth/actions';

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      alert("All fields are required.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        const profileCreationResult = await createRTDBUserProfileOnSignup({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.email?.split('@')[0], // Default display name
          photoURL: `https://placehold.co/100x100.png?text=${userCredential.user.email?.[0]?.toUpperCase() || 'U'}`, // Default photo
          role: 'user', // Explicitly set role for the action
        });

        if (!profileCreationResult.success) {
          // Log the user out if DB profile creation fails to avoid inconsistent states
          await auth.signOut();
          alert(profileCreationResult.message || "Could not create your profile in the database. Please contact support.");
          setIsLoading(false);
          return;
        }
      }
      // After successful signup and profile creation, onAuthStateChanged in AppContentWrapper
      // will handle redirecting the user to the appropriate page (e.g., /pending-verification).
      // We can push to a neutral page like '/' and let the wrapper handle the logic.
      router.push('/');
    } catch (error: any) {
      setIsLoading(false); 
      const firebaseError = error as AuthError;

      if (firebaseError.code === 'auth/email-already-in-use') {
        alert('This email is already in use. Please try a different email or log in.');
      } else if (firebaseError.code === 'auth/weak-password') {
        alert('The password is too weak. Please choose a stronger password.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        alert('The email address is not valid.');
      }
      else {
        alert('An error occurred during sign up. Please try again later.');
      }
    } 
    // No finally block needed as loading is handled in each branch
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-body text-sm font-medium text-foreground/80">Email Address</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="you@example.com" 
          required 
          className="font-body"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="font-body text-sm font-medium text-foreground/80">Password</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          placeholder="•••••••• (min. 6 characters)" 
          required 
          className="font-body"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-body text-sm font-medium text-foreground/80">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          name="confirmPassword" 
          type="password" 
          placeholder="••••••••" 
          required 
          className="font-body"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full font-body font-semibold text-base py-3 h-auto" disabled={isLoading}>
        {isLoading ? (
            <UserPlus className="mr-2 h-5 w-5 animate-spin" />
        ) : (
            <UserPlus className="mr-2 h-5 w-5" />
        )}
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
}
