
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Gem, Trash2, PlusCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionPlans, saveSubscriptionPlan, deleteSubscriptionPlan } from '@/app/auth/actions';
import type { SubscriptionPlan } from '@/app/usage/page';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


// Default structure for a new plan
const newPlanDefault: Omit<SubscriptionPlan, 'id'> = {
  name: 'New Plan',
  price: '₹',
  pricePeriod: '/month',
  description: 'A new subscription plan.',
  features: [{ text: 'New Feature', included: true }],
  cta: 'Upgrade plan',
  variant: 'outline',
  trialDays: 0,
};

const defaultTrialPlan: SubscriptionPlan = {
  id: 'trial',
  name: 'Free Trial',
  price: '₹0',
  pricePeriod: '',
  description: 'Get started with our basic features.',
  features: [
    { text: '100 API Calls', included: true },
    { text: 'Basic Support', included: true },
  ],
  cta: 'Start Trial',
  variant: 'default',
  trialDays: 14
};

export function SubscriptionPlanSettings() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null); // Saving state per plan ID

  const fetchPlans = async () => {
    setIsLoading(true);
    const result = await getSubscriptionPlans();
    if (result.success && result.data) {
        let fetchedPlans = result.data;
        // Ensure a trial plan always exists.
        const hasTrialPlan = fetchedPlans.some(p => p.id === 'trial');
        if (!hasTrialPlan) {
            fetchedPlans = [defaultTrialPlan, ...fetchedPlans];
        }
        setPlans(fetchedPlans);
    } else {
      toast({
        variant: "destructive",
        title: "Failed to load plans",
        description: result.error || "Could not fetch plans from DB.",
      });
      setPlans([defaultTrialPlan]); // Set default even on failure
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchPlans();
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
  
  const handleAddNewPlan = () => {
      // Use a temporary ID for the new plan for state management
      const tempId = `new-${Date.now()}`;
      setPlans(prevPlans => [...prevPlans, { ...newPlanDefault, id: tempId, cta: 'Upgrade Plan' }]);
  };

  const handleRemovePlan = async (planId: string) => {
      // Prevent deleting the default trial plan
      if(planId === 'trial') {
        toast({ variant: 'destructive', title: 'Action Not Allowed', description: 'The default Free Trial plan cannot be deleted.' });
        return;
      }

      // If it's a new plan that hasn't been saved, just remove from state
      if(planId.startsWith('new-')) {
          setPlans(prevPlans => prevPlans.filter(p => p.id !== planId));
          return;
      }
      
      const result = await deleteSubscriptionPlan(planId);
      if(result.success) {
          toast({ title: "Plan Removed", description: "The subscription plan has been deleted." });
          await fetchPlans(); // Refresh from DB
      } else {
          toast({ variant: "destructive", title: "Deletion Failed", description: result.error || "Could not delete the plan." });
      }
  };


  const handleSave = async (plan: SubscriptionPlan) => {
    setIsSaving(plan.id);
    const { id, isCurrent, ...planData } = plan;
    
    // Check if it's a new plan (has temp ID) or an existing one
    const isNew = id.startsWith('new-');
    const result = await saveSubscriptionPlan(planData, isNew ? undefined : id);

    if (result.success) {
      toast({
        title: "Plan Saved",
        description: `"${plan.name}" plan has been saved successfully.`,
      });
      await fetchPlans(); // Refresh all plans from DB to get new IDs and ensure consistency
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
            {plans.sort((a, b) => {
                if (a.id === 'trial') return -1; // always show trial first
                if (b.id === 'trial') return 1;
                return a.price.localeCompare(b.price, undefined, { numeric: true })
            }).map(plan => (
                <AccordionItem value={plan.id} key={plan.id} className="border rounded-lg px-4 bg-background">
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
                            <div className="space-y-1">
                                <Label htmlFor={`trialDays-${plan.id}`}>Trial Duration (Days)</Label>
                                <Input id={`trialDays-${plan.id}`} type="number" value={plan.trialDays || 0} onChange={(e) => handlePlanChange(plan.id, 'trialDays', parseInt(e.target.value) || 0)} disabled={isSaving === plan.id} />
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`cta-${plan.id}`}>Button Text (CTA)</Label>
                                <Input id={`cta-${plan.id}`} value={plan.cta} onChange={(e) => handlePlanChange(plan.id, 'cta', e.target.value)} disabled={isSaving === plan.id} />
                            </div>
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
                        
                        <div className="flex justify-between pt-4 border-t">
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isSaving === plan.id || plan.id === 'trial'}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove Plan
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the <strong>{plan.name}</strong> plan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRemovePlan(plan.id)} className="bg-destructive hover:bg-destructive/90">
                                        Yes, delete it
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button onClick={() => handleSave(plan)} disabled={isSaving === plan.id}>
                                {isSaving === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSaving === plan.id ? 'Saving...' : 'Save Plan'}
                            </Button>
                        </div>

                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>

        <div className="mt-6">
            <Button onClick={handleAddNewPlan} variant="outline" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add New Plan
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
