
"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword, browserLocalPersistence, setPersistence, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { createUserProfile } from '@/app/auth/actions'; // Using new Firestore action

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        const profileCreationResult = await createUserProfile({ // Using new Firestore action
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.email?.split('@')[0], // Default display name
          photoURL: `https://placehold.co/100x100.png?text=${userCredential.user.email?.[0]?.toUpperCase() || 'U'}`, // Default photo
        });

        if (!profileCreationResult.success) {
          // Log the user out if DB profile creation fails to avoid inconsistent states
          await auth.signOut();
          setError(profileCreationResult.message || "Could not create your profile. Please contact support.");
          setIsLoading(false);
          return;
        }
      }
      // The AppContentWrapper now handles all redirection logic.
    } catch (e: any) {
      const firebaseError = e as AuthError;

      if (firebaseError.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please try a different email or log in.');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a stronger password.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else if (firebaseError.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-up is not enabled. Please enable it in your Firebase console under Authentication > Sign-in method.');
      }
      else {
        setError('An error occurred during sign up. Please try again later.');
      }
      setIsLoading(false); 
    } 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm font-medium text-center text-destructive">{error}</p>}
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
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
            <UserPlus className="mr-2 h-5 w-5" />
        )}
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </Button>
    </form>
  );
}
