
"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword, browserLocalPersistence, setPersistence, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import { updateRTDBUserProfileOnLogin } from '@/app/auth/actions';
// useToast import removed as we are switching to alert()

export function LoginForm() {
  const router = useRouter();
  // const { toast } = useToast(); // Removed useToast
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Removed client-side error state, as alert will be used directly.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      alert("Email and password are required."); // Switched to alert
      setIsLoading(false);
      return;
    }

    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        const profileUpdateResult = await updateRTDBUserProfileOnLogin({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
        });

        if (!profileUpdateResult.success) {
          // For DB errors, we can still use alert or keep toast if preferred for non-auth errors
          alert(profileUpdateResult.message || "Could not update your profile in the database.");
        }
      }
      // onAuthStateChanged in AppContentWrapper will handle redirect to dashboard
      // No explicit router.push('/') here to allow onAuthStateChanged to be the source of truth for redirection.
      // Successful login will be handled by onAuthStateChanged, which should redirect.
    } catch (error: any) {
      console.error("Login failed (Firebase Auth Error):", error);
      const firebaseError = error as AuthError;
      if (firebaseError.code === 'auth/invalid-credential') {
        alert('Invalid email or password. Please try again.');
      } else {
        alert('An error occurred during sign in. Please try again later.');
        // console.error(error); // console.error is already done above
      }
    } finally {
      setIsLoading(false);
    }
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
          <LogIn className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-5 w-5" />
        )}
        {isLoading ? 'Logging In...' : 'Log In'}
      </Button>
    </form>
  );
}
