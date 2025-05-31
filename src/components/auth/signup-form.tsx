
"use client";

import React, { useEffect } from 'react';
import { useActionState } from 'react';
import { signUpWithEmailPassword, type AuthFormState } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';

const initialState: AuthFormState = {
  success: false,
  message: '',
};

export function SignupForm() {
  const [state, formAction] = useActionState(signUpWithEmailPassword, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: state.message,
      });
    }
    // Successful signup is handled by server-side redirect in the action
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-body text-sm font-medium text-foreground/80">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required className="font-body"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="font-body text-sm font-medium text-foreground/80">Password</Label>
        <Input id="password" name="password" type="password" placeholder="•••••••• (min. 6 characters)" required className="font-body"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-body text-sm font-medium text-foreground/80">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required className="font-body"/>
      </div>
      <Button type="submit" className="w-full font-body font-semibold text-base py-3 h-auto">
        <UserPlus className="mr-2 h-5 w-5" /> Sign Up
      </Button>
    </form>
  );
}
