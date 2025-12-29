
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Gem, Trash2, PlusCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionPlans, saveSubscriptionPlan } from '@/app/auth/actions';
import type { SubscriptionPlan } from '@/app/usage/page';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


// Default structure for plans if they don't exist in Firestore
const defaultPlans: SubscriptionPlan[] = [
    {
      id: 'trial',
      name: 'Free Trial',
      price: '₹0',
      pricePeriod: '',
      description: 'A temporary plan to explore features.',
      features: [
        { text: '1,000 API Calls/mo', included: true },
        { text: '1 GB Storage', included: true },
        { text: '1 Vendor Account', included: true },
      ],
      cta: 'Start Trial',
      variant: 'default',
      trialDays: 14,
    },
    {
      id: 'basic',
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
      variant: 'outline',
    },
    {
      id: 'pro',
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
      variant: 'default',
    },
    {
      id: 'enterprise',
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
      variant: 'outline',
    },
];

export function SubscriptionPlanSettings() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null); // Saving state per plan ID

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      const result = await getSubscriptionPlans();
      if (result.success && result.data && result.data.length > 0) {
        setPlans(result.data);
      } else {
        // If no plans in DB, populate with defaults for the admin to save.
        setPlans(defaultPlans);
        if (!result.success) {
          toast({
            variant: "destructive",
            title: "Failed to load plans",
            description: result.error || "Could not fetch plans from DB. Showing defaults.",
          });
        }
      }
      setIsLoading(false);
    }
    fetchDetails();
  }, [toast]);

  const handlePlanChange = (planId: string, field: keyof SubscriptionPlan, value: any) => {
    setPlans(prevPlans =>
      prevPlans.map(p => (p.id === planId ? { ...p, [field]: value } : p))
    );
  };

  const handleFeatureChange = (planId: string, featureIndex: number, field: 'text' | 'included', value: any) => {
    setPlans(prevPlans =>
      prevPlans.map(p => {
        if (p.id === planId) {
          const newFeatures = [...p.features];
          newFeatures[featureIndex] = { ...newFeatures[featureIndex], [field]: value };
          return { ...p, features: newFeatures };
        }
        return p;
      })
    );
  };
  
  const handleAddFeature = (planId: string) => {
     setPlans(prevPlans =>
      prevPlans.map(p => {
        if (p.id === planId) {
          return { ...p, features: [...p.features, { text: '', included: true }] };
        }
        return p;
      })
    );
  };

  const handleRemoveFeature = (planId: string, featureIndex: number) => {
     setPlans(prevPlans =>
      prevPlans.map(p => {
        if (p.id === planId) {
          const newFeatures = p.features.filter((_, i) => i !== featureIndex);
          return { ...p, features: newFeatures };
        }
        return p;
      })
    );
  };


  const handleSave = async (plan: SubscriptionPlan) => {
    setIsSaving(plan.id);
    const result = await saveSubscriptionPlan(plan);
    if (result.success) {
      toast({
        title: "Plan Saved",
        description: `"${plan.name}" plan has been updated.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: result.error || `Could not save the "${plan.name}" plan.`,
      });
    }
    setIsSaving(null);
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <Gem className="mr-2 h-5 w-5 text-primary" /> Subscription Plans
          </CardTitle>
          <CardDescription className="font-body">
            Manage the details for each subscription plan offered to vendors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Gem className="mr-2 h-5 w-5 text-primary" /> Subscription Plans
        </CardTitle>
        <CardDescription className="font-body">
          Manage the details for each subscription plan offered to vendors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
            {plans.sort((a, b) => a.price.localeCompare(b.price, undefined, { numeric: true })).map(plan => (
                <AccordionItem value={plan.id} key={plan.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="font-semibold text-lg hover:no-underline">
                        {plan.name}
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor={`name-${plan.id}`}>Plan Name</Label>
                                <Input id={`name-${plan.id}`} value={plan.name} onChange={(e) => handlePlanChange(plan.id, 'name', e.target.value)} disabled={isSaving === plan.id} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor={`price-${plan.id}`}>Price</Label>
                                <Input id={`price-${plan.id}`} value={plan.price} onChange={(e) => handlePlanChange(plan.id, 'price', e.target.value)} disabled={isSaving === plan.id} />
                            </div>
                             {plan.id === 'trial' && (
                                <div className="space-y-1">
                                    <Label htmlFor={`trialDays-${plan.id}`}>Trial Duration (Days)</Label>
                                    <Input id={`trialDays-${plan.id}`} type="number" value={plan.trialDays || 0} onChange={(e) => handlePlanChange(plan.id, 'trialDays', parseInt(e.target.value) || 0)} disabled={isSaving === plan.id} />
                                </div>
                            )}
                             <div className="space-y-1 md:col-span-2">
                                <Label htmlFor={`desc-${plan.id}`}>Description</Label>
                                <Input id={`desc-${plan.id}`} value={plan.description} onChange={(e) => handlePlanChange(plan.id, 'description', e.target.value)} disabled={isSaving === plan.id} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Features</Label>
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Switch
                                        id={`included-${plan.id}-${index}`}
                                        checked={feature.included}
                                        onCheckedChange={(checked) => handleFeatureChange(plan.id, index, 'included', checked)}
                                        disabled={isSaving === plan.id}
                                    />
                                    <Input 
                                        value={feature.text} 
                                        onChange={(e) => handleFeatureChange(plan.id, index, 'text', e.target.value)}
                                        className="flex-1 h-9"
                                        disabled={isSaving === plan.id}
                                     />
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => handleRemoveFeature(plan.id, index)} disabled={isSaving === plan.id}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                             <Button type="button" variant="outline" size="sm" onClick={() => handleAddFeature(plan.id)} disabled={isSaving === plan.id}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                            </Button>
                        </div>
                        
                        <div className="flex justify-end pt-4 border-t">
                            <Button onClick={() => handleSave(plan)} disabled={isSaving === plan.id}>
                                {isSaving === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving === plan.id ? 'Saving...' : 'Save Plan'}
                            </Button>
                        </div>

                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
