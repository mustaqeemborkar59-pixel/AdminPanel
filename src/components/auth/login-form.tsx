
"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword, browserLocalPersistence, setPersistence, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import { updateRTDBUserProfileOnLogin } from '@/app/auth/actions';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Email and password are required.",
      });
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
          toast({
            variant: "destructive",
            title: "Profile Update Failed",
            description: profileUpdateResult.message || "Could not update your profile in the database.",
          });
          // Depending on app requirements, you might consider this a partial success or handle it differently.
          // For now, login is considered successful if Firebase auth passed, and user is notified of DB issue.
        }
      }
      // onAuthStateChanged in AppContentWrapper will handle redirect to dashboard
      // No explicit router.push('/') here to allow onAuthStateChanged to be the source of truth for redirection.
    } catch (error: any) {
      console.error("Login failed (Firebase Auth Error):", error);
      let message = "An unknown error occurred during sign in.";
      const firebaseError = error as AuthError;
      if (firebaseError.code) {
        switch (firebaseError.code) {
          case 'auth/invalid-credential':
            message = 'Invalid email or password. Please try again.';
            break;
          case 'auth/user-disabled':
            message = 'This user account has been disabled.';
            break;
          case 'auth/invalid-email':
            message = 'The email address is not valid.';
            break;
          default:
            message = firebaseError.message || `Sign in failed. (Code: ${firebaseError.code})`;
        }
      } else if (error.message) {
         message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
      });
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
