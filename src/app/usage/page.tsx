
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Gem, Loader2, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import { Badge } from '@/components/ui/badge';
import { getSubscriptionPlans } from '@/app/auth/actions'; // Using new Firestore action
import { Skeleton } from '@/components/ui/skeleton';

// The local data is now removed, as we will fetch it from Firestore.
// We define a type for the plan data we expect.
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.sort((a, b) => {
              if (a.id === 'trial') return -1;
              if (b.id === 'trial') return 1;
              return a.price.localeCompare(b.price, undefined, { numeric: true });
            }).map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col",
                plan.isCurrent && "border-primary border-2 relative"
              )}
            >
              {plan.isCurrent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Current Plan</Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                {plan.trialDays && plan.trialDays > 0 && plan.price === '₹0' && (
                   <Badge variant="secondary" className="w-fit mx-auto mt-2">{plan.trialDays}-Day Free Trial</Badge>
                )}
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <div className="text-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.pricePeriod && plan.price !== '₹0' && (
                      <span className="text-muted-foreground">{plan.pricePeriod}</span>
                    )}
                </div>
                <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            {feature.included ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <X className="h-4 w-4 text-red-400" />
                            )}
                            <span className={cn(!feature.included && "text-muted-foreground line-through")}>
                                {feature.text}
                            </span>
                        </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.isCurrent ? 'secondary' : (plan.variant as any)}
                  disabled={plan.isCurrent}
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
