
"use client";

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom'; // For React 18.3 server actions
import { signInWithEmailPassword, type AuthFormState } from '@/app/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
// Alert components can be used if specific non-toast error display is needed below fields
// import { AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState: AuthFormState = {
  success: false,
  message: '',
};

export function LoginForm() {
  const [state, formAction] = useFormState(signInWithEmailPassword, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.success) { // Only show toast for errors
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: state.message,
      });
    }
    // Successful login is handled by server-side redirect in the action
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-body text-sm font-medium text-foreground/80">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required className="font-body"/>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="font-body text-sm font-medium text-foreground/80">Password</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required className="font-body"/>
      </div>
      <Button type="submit" className="w-full font-body font-semibold text-base py-3 h-auto">
        <LogIn className="mr-2 h-5 w-5" /> Log In
      </Button>
    </form>
  );
}
