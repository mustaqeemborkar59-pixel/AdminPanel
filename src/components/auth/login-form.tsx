
"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword, browserLocalPersistence, setPersistence, type AuthError } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2 } from 'lucide-react';
import { updateUserProfile } from '@/app/auth/actions'; // Using new Firestore action

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      // The AppContentWrapper now handles all redirection and profile checking logic.
      // No need to call updateUserProfile here, as it was causing issues with the 'disabled' state.
    } catch (e: any) {
      const firebaseError = e as AuthError;
      if (firebaseError.code === 'auth/invalid-credential' || firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (firebaseError.code === 'auth/user-disabled') {
        setError('This user account has been disabled by an administrator.');
      } else if (firebaseError.code === 'auth/invalid-email') {
        setError('The email address is not valid.');
      } else if (firebaseError.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled. Please enable it in your Firebase console.');
      }
      else {
        setError('An error occurred during sign in. Please try again later.');
        console.error("Login Error:", firebaseError);
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          placeholder="••••••••" 
          required 
          className="font-body"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full font-body font-semibold text-base py-3 h-auto" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-5 w-5" />
        )}
        {isLoading ? 'Logging In...' : 'Log In'}
      </Button>
    </form>
  );
}
