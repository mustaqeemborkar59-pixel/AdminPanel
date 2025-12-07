
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { saveCompanyDetailsToRTDB, getCompanyDetailsFromRTDB } from "@/app/auth/actions";
import { Skeleton } from "../ui/skeleton";


export function CompanyDetailsSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State to hold form data.
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  
  const defaultDetails = {
    companyName: "Your Company",
    address: "123 Business Rd, Suite 100",
    city: "Your City, State, 12345",
    email: "contact@yourcompany.com",
  };

  useEffect(() => {
    async function fetchDetails() {
      setIsLoading(true);
      const result = await getCompanyDetailsFromRTDB();
      if (result.success && result.data) {
        setCompanyName(result.data.companyName);
        setAddress(result.data.address);
        setCity(result.data.city);
        setEmail(result.data.email);
      } else {
        // Set default values if no data is found in DB
        setCompanyName(defaultDetails.companyName);
        setAddress(defaultDetails.address);
        setCity(defaultDetails.city);
        setEmail(defaultDetails.email);
        if(!result.success){
             toast({
                variant: "destructive",
                title: "Failed to load settings",
                description: result.message || "Could not fetch company details from the database.",
            });
        }
      }
      setIsLoading(false);
    }
    fetchDetails();
  }, [toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const details = { companyName, address, city, email };
    const result = await saveCompanyDetailsToRTDB(details);

    if (result.success) {
        toast({
            title: "Settings Saved",
            description: "Your company details have been updated.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Save Failed",
            description: result.message || "Could not save company details.",
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
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="font-body" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Company Details'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
