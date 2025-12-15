
"use client";

import { Logo } from '@/components/layout/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Hourglass } from 'lucide-react';

export default function PendingVerificationPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="w-full max-w-lg text-center shadow-2xl bg-card/80 backdrop-blur-lg">
        <CardHeader>
          <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
            <Hourglass className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-headline text-primary mt-4">Verification Pending</CardTitle>
          <CardDescription className="text-muted-foreground font-body pt-2 max-w-sm mx-auto">
            Your account has been created successfully. A super admin needs to verify your account and assign you a role before you can proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/80 mb-6">
            Please contact your administrator if you think this is a mistake. You will be able to log in and access the dashboard once your account is approved.
          </p>
          <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
