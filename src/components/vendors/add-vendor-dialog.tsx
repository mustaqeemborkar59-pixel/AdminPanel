
"use client";

import { useState, useEffect, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2, Percent } from "lucide-react";
import type { Vendor } from '@/types';

interface AddVendorDialogProps {
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => Promise<void>;
  existingVendor?: Vendor;
  triggerButton?: ReactNode;
}

const defaultState: Omit<Vendor, 'id'> = {
  name: '',
  code: '',
  profitMargin: 0,
};

export function AddVendorDialog({ onAddVendor, existingVendor, triggerButton }: AddVendorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Vendor, 'id'>>(defaultState);

  useEffect(() => {
    if (existingVendor && isOpen) {
      setFormData({
        name: existingVendor.name,
        code: existingVendor.code,
        profitMargin: existingVendor.profitMargin || 0,
      });
    } else if (!existingVendor && isOpen) {
      setFormData(defaultState);
    }
  }, [existingVendor, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
     setFormData({ 
        ...formData, 
        [name]: type === 'number' ? parseFloat(value) || 0 : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
        alert("Vendor Name and Code are required.");
        return;
    }
    setIsSaving(true);
    await onAddVendor(formData);
    setIsSaving(false);
    setIsOpen(false);
    if (!existingVendor) {
        setFormData(defaultState);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : 
        <Button className="font-body">
          <Store className="mr-2 h-4 w-4" /> Add Vendor
        </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{existingVendor ? 'Edit' : 'Add New'} Vendor</DialogTitle>
          <DialogDescription className="font-body">
            Fill in the details for the vendor. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-body">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3 font-body" required placeholder="e.g., Sakib Traders" disabled={isSaving}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right font-body">Code</Label>
            <Input id="code" name="code" value={formData.code} onChange={handleChange} className="col-span-3 font-body" required placeholder="e.g., ST_GI" disabled={isSaving}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profitMargin" className="text-right font-body">Profit %</Label>
            <div className="col-span-3 relative">
                <Input id="profitMargin" name="profitMargin" type="number" value={formData.profitMargin} onChange={handleChange} className="font-body pl-2 pr-8" required placeholder="e.g., 15" disabled={isSaving}/>
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-body" disabled={isSaving}>Cancel</Button>
            <Button type="submit" className="font-body" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                {isSaving ? 'Saving...' : (existingVendor ? 'Save Changes' : 'Add Vendor')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

    