
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Loader2, Power } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { saveCompanyDetailsToFirestore, getCompanyDetailsFromFirestore } from "@/app/auth/actions";
import { Skeleton } from "../ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from "../layout/app-content-wrapper";
import { doc, onSnapshot } from "firebase/firestore";
import { useFirebase } from "@/firebase";


export function CompanyDetailsSettings() {
  const { toast } = useToast();
  const { userProfile, companyDetails: contextCompanyDetails, refreshCompanyDetails } = useAppContext();
  const { firestore } = useFirebase();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State to hold form data.
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [isSubscriptionEnabled, setIsSubscriptionEnabled] = useState(false);

  const isSuperAdmin = userProfile?.role === 'super-admin';
  
  const defaultDetails = {
    companyName: "Your Company",
    address: "123 Business Rd, Suite 100",
    city: "Your City, State, 12345",
    email: "contact@yourcompany.com",
    isSubscriptionEnabled: false,
  };

  useEffect(() => {
    // We now get live updates from the context, which is fed by a real-time listener
    // in AppContentWrapper. We just need to sync the local form state.
     if (contextCompanyDetails !== undefined) {
      const details = contextCompanyDetails ?? defaultDetails;
      setCompanyName(details.companyName);
      setAddress(details.address);
      setCity(details.city);
      setEmail(details.email);
      setIsSubscriptionEnabled(details.isSubscriptionEnabled ?? false);
      setIsLoading(false);
    }
  }, [contextCompanyDetails]);


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setIsSaving(true);
    
    const detailsToSave = { 
        companyName, 
        address, 
        city, 
        email,
        isSubscriptionEnabled,
    };
    
    const detailsRef = doc(firestore, 'companyDetails', 'info');

    try {
        await (await import('firebase/firestore')).setDoc(detailsRef, detailsToSave, { merge: true });
        toast({
            title: "Settings Saved",
            description: "Your company details have been updated.",
        });
        // No need to manually call refresh, the listener will pick it up.
    } catch (error: any) {
        console.error('Firestore Save Error (Client - Company Details):', error);
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: error.message || "Could not save company details.",
        });
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
        <Card className="shadow-lg">
             <CardHeader>
                <CardTitle className="font-headline flex items-center">
                    <Building className="mr-2 h-5 w-5 text-primary" /> Company Details
                </CardTitle>
                <CardDescription className="font-body">
                    Set your company information for invoices and other documents.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-44" />
            </CardContent>
        </Card>
    );
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <Building className="mr-2 h-5 w-5 text-primary" /> Company Details
        </CardTitle>
        <CardDescription className="font-body">
          Set your company information for invoices and other documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="companyName" className="font-body">Company Name</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="font-body" disabled={isSaving}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="address" className="font-body">Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="font-body" disabled={isSaving}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="city" className="font-body">City, State, Pincode</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="font-body" disabled={isSaving}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="font-body">Contact Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="font-body" disabled={isSaving}/>
            </div>
          </div>
          
          {isSuperAdmin && (
             <>
                <div className="my-6 border-t" />
                <div className="space-y-3 p-4 border rounded-lg bg-background">
                     <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="subscription-switch" className="font-semibold flex items-center gap-2">
                                <Power className="h-5 w-5 text-primary"/>
                                Enable Subscription System
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">If disabled, all vendors will have free access to premium features.</p>
                        </div>
                        <Switch
                            id="subscription-switch"
                            checked={isSubscriptionEnabled}
                            onCheckedChange={setIsSubscriptionEnabled}
                            disabled={isSaving}
                        />
                     </div>
                </div>
            </>
          )}

          <div className="mt-6">
            <Button type="submit" className="font-body" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

