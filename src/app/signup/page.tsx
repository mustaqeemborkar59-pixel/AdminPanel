
import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/layout/logo';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="absolute top-8 left-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Create Your Account</CardTitle>
          <CardDescription className="text-muted-foreground font-body pt-1">
            Join to manage your online shop efficiently.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <SignupForm />
          <p className="mt-6 text-center text-sm text-muted-foreground font-body">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
