
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import { Badge } from '@/components/ui/badge';
import { getSubscriptionPlans } from '@/app/auth/actions'; // Using new Firestore action
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// The local data is now removed, as we will fetch it from Firestore.
// We define a type for the plan data we expect.
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  regularPrice?: string; // For strikethrough price
  pricePeriod: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  variant: 'outline' | 'default';
  isCurrent?: boolean; // This will be determined client-side
  trialDays?: number;
}


export default function SubscriptionPage() {
  const { userProfile, authLoading } = useAppContext();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number; } | null>(null);

  const isVendor = userProfile?.role === 'vendor';

  useEffect(() => {
    async function fetchPlans() {
      if (!authLoading && isVendor) {
        setDataLoading(true);
        const result = await getSubscriptionPlans();
        if (result.success && result.data) {
          // In a real app, this would be based on the user's actual subscription.
          // For now, we'll default new users to the 'trial' plan if no other plan is active.
          const hasActivePlan = result.data.some(p => p.isCurrent); // This would come from user profile in a real app

          const plansWithCurrent = result.data.map(p => ({
            ...p,
            // If no plan is active, mark the trial plan as current.
            isCurrent: !hasActivePlan && p.id === 'trial',
          }));
          setPlans(plansWithCurrent);
        } else {
          // Handle error case, maybe show a toast
          console.error("Failed to fetch subscription plans:", result.error);
        }
        setDataLoading(false);
      } else if (!authLoading) {
        setDataLoading(false);
      }
    }
    fetchPlans();
  }, [authLoading, isVendor]);

  useEffect(() => {
    const currentPlan = plans.find(p => p.isCurrent);
    if (currentPlan && currentPlan.trialDays && userProfile?.subscriptionStartDate) {
      // Use the stored subscription start date from the user profile
      const subscriptionStartDate = new Date(userProfile.subscriptionStartDate); 
      const end = new Date(subscriptionStartDate.getTime());
      end.setDate(end.getDate() + currentPlan.trialDays);
      setEndDate(end);
    }
  }, [plans, userProfile?.subscriptionStartDate]);


  useEffect(() => {
    if (!endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (authLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Manage Your Subscription"
          description="View, manage, and upgrade your current plan."
        />
        <div className="flex-1 p-4 md:p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isVendor) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Manage Your Subscription"
          description="This page is only available for vendors."
        />
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-center items-center text-center">
          <Lock className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground mt-2">Only vendors can view this page.</p>
        </div>
      </div>
    );
  }

  if (dataLoading) {
     return (
       <div className="flex flex-col h-full">
        <PageHeader
          title="Manage Your Subscription"
          description="Choose the plan that's right for your business."
        />
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-lg flex flex-col">
                <CardHeader className="text-center">
                  <Skeleton className="h-6 w-2/4 mx-auto" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="flex-grow space-y-6">
                  <div className="text-center space-y-2">
                    <Skeleton className="h-8 w-1/3 mx-auto" />
                  </div>
                  <ul className="space-y-3 text-sm">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <li key={j} className="flex items-center gap-3">
                         <Skeleton className="h-4 w-4 rounded-full" />
                         <Skeleton className="h-4 w-3/4" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                   <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
     );
  }


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Your Subscription"
        description="Choose the plan that's right for your business."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
      
        {timeLeft && (
            <Card className="mb-8 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-amber-500/50 shadow-lg">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold text-amber-800 dark:text-amber-300">Premium Ends In</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400">Your current trial plan is ending soon.</p>
                    </div>
                    <div className="flex items-center gap-4 text-center">
                        <div>
                            <p className="text-4xl font-bold text-amber-900 dark:text-amber-200">{timeLeft.days}</p>
                            <p className="text-xs uppercase text-amber-800/80 dark:text-amber-300/80">Days</p>
                        </div>
                         <div className="text-2xl font-semibold opacity-50">:</div>
                        <div>
                            <p className="text-4xl font-bold text-amber-900 dark:text-amber-200">{String(timeLeft.hours).padStart(2, '0')}</p>
                            <p className="text-xs uppercase text-amber-800/80 dark:text-amber-300/80">Hours</p>
                        </div>
                         <div className="text-2xl font-semibold opacity-50">:</div>
                        <div>
                            <p className="text-4xl font-bold text-amber-900 dark:text-amber-200">{String(timeLeft.minutes).padStart(2, '0')}</p>
                            <p className="text-xs uppercase text-amber-800/80 dark:text-amber-300/80">Minutes</p>
                        </div>
                         <div className="text-2xl font-semibold opacity-50">:</div>
                        <div>
                            <p className="text-4xl font-bold text-amber-900 dark:text-amber-200">{String(timeLeft.seconds).padStart(2, '0')}</p>
                            <p className="text-xs uppercase text-amber-800/80 dark:text-amber-300/80">Seconds</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.sort((a, b) => {
              if (a.id === 'trial') return -1;
              if (b.id === 'trial') return 1;
              return a.price.localeCompare(b.price, undefined, { numeric: true });
            }).map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-1",
                plan.isCurrent && "border-primary border-2 ring-2 ring-primary/20",
                plan.variant === 'default' && !plan.isCurrent && "bg-primary/5 dark:bg-primary/10"
              )}
            >
              {plan.isCurrent && (
                <Badge className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 text-sm">Current Plan</Badge>
              )}
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="pt-1">{plan.description}</CardDescription>
              </CardHeader>
              
              
              <div className="px-6 pb-2 text-center">
                  {plan.trialDays && plan.trialDays > 0 && (
                     <Badge variant="outline" className="w-fit mx-auto font-semibold border-amber-400/30 bg-amber-400/20 text-amber-600 dark:text-amber-400">
                      {plan.price === '₹0' ? `${plan.trialDays}-Day Free Trial` : `Duration: ${plan.trialDays} Days`}
                    </Badge>
                  )}
              </div>

              <CardContent className="flex-grow flex flex-col justify-between pt-4">
                <div className="my-6">
                    <div className="text-center flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                        {plan.regularPrice && (
                          <span className="text-xl font-medium text-muted-foreground line-through">
                            {plan.regularPrice}
                          </span>
                        )}
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <Separator />
                    <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                {feature.included ? (
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                ) : (
                                    <X className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                )}
                                <span className={cn("flex-1", !feature.included && "text-muted-foreground line-through")}>
                                    {feature.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
              </CardContent>
              <CardFooter className="p-6">
                <Button
                  className="w-full text-base h-11 font-semibold"
                  variant={plan.isCurrent ? 'secondary' : (plan.variant as any)}
                  disabled={plan.isCurrent}
                  size="lg"
                >
                  {plan.isCurrent ? 'Your Current Plan' : plan.cta || "Upgrade plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
