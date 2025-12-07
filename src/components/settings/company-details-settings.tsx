
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function CompanyDetailsSettings() {
  const { toast } = useToast();
  // Placeholder state. In a real app, this would come from a DB or global state.
  const [companyName, setCompanyName] = useState("Your Company");
  const [address, setAddress] = useState("123 Business Rd, Suite 100");
  const [city, setCity] = useState("Your City, State, 12345");
  const [email, setEmail] = useState("contact@yourcompany.com");

  // Placeholder handler.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save company settings would go here.
    // For now, just show a success toast.
    toast({
        title: "Settings Saved",
        description: "Your company details have been updated.",
    });
    console.log("Company settings saved:", { companyName, address, city, email });
  };

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
            <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="font-body" />
          </div>
           <div className="space-y-1">
            <Label htmlFor="address" className="font-body">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="font-body" />
          </div>
           <div className="space-y-1">
            <Label htmlFor="city" className="font-body">City, State, Pincode</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="font-body" />
          </div>
           <div className="space-y-1">
            <Label htmlFor="email" className="font-body">Contact Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="font-body" />
          </div>
          <Button type="submit" className="font-body">Save Company Details</Button>
        </form>
      </CardContent>
    </Card>
  );
}
