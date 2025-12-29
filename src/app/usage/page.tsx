
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Gem, Loader2, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import { Badge } from '@/components/ui/badge';


// --- MOCK DATA FOR SUBSCRIPTION PLANS ---
const subscriptionPlans = [
  {
    name: 'Basic',
    price: '₹0',
    pricePeriod: '/month',
    description: 'For individuals and small teams just getting started.',
    features: [
      { text: '10,000 API Calls/mo', included: true },
      { text: '5 GB Storage', included: true },
      { text: '1 Vendor Account', included: true },
      { text: 'Basic Analytics', included: true },
      { text: 'Community Support', included: true },
      { text: 'Email Support', included: false },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Downgrade',
    variant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '₹4,999',
    pricePeriod: '/month',
    description: 'For growing businesses that need more power and support.',
    features: [
      { text: '500,000 API Calls/mo', included: true },
      { text: '50 GB Storage', included: true },
      { text: '5 Admin Accounts', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'Community Support', included: true },
      { text: 'Email Support', included: true },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Your Current Plan',
    variant: 'default' as const,
    isCurrent: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    pricePeriod: '',
    description: 'For large-scale applications with custom needs.',
    features: [
      { text: 'Unlimited API Calls', included: true },
      { text: 'Unlimited Storage', included: true },
      { text: 'Unlimited Accounts', included: true },
      { text: 'Advanced Analytics & Reporting', included: true },
      { text: 'Community Support', included: true },
      { text: 'Email Support', included: true },
      { text: 'Priority Support', included: true },
    ],
    cta: 'Contact Sales',
    variant: 'outline' as const,
  },
];


export default function SubscriptionPage() {
  const { userProfile, authLoading } = useAppContext();
  const [initialLoading, setInitialLoading] = useState(true);

  const isVendor = userProfile?.role === 'vendor';

  useEffect(() => {
    if (!authLoading) {
      setInitialLoading(false);
    }
  }, [authLoading]);

  if (authLoading || initialLoading) {
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


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Your Subscription"
        description="Choose the plan that's right for your business."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <Card
              key={plan.name}
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
              </CardHeader>
              <CardContent className="flex-grow space-y-6">
                <div className="text-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.pricePeriod && <span className="text-muted-foreground">{plan.pricePeriod}</span>}
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
                  variant={plan.variant}
                  disabled={plan.isCurrent}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
