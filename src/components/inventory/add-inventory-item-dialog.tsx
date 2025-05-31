
"use client";

import { useState, useEffect } from 'react';
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
import { PlusCircle } from "lucide-react";
import { type InventoryItem } from '@/types';

interface AddInventoryItemDialogProps {
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  existingItem?: InventoryItem;
}

const defaultState: Omit<InventoryItem, 'id'> = {
  name: '',
  quantity: 0,
  unit: '',
  alertLevel: 0,
  vendor: '',
};

export function AddInventoryItemDialog({ onAddItem, existingItem }: AddInventoryItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>(defaultState);

  useEffect(() => {
    if (existingItem) {
      setFormData(existingItem);
    } else {
      setFormData(defaultState);
    }
  }, [existingItem, isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
     if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(formData);
    setIsOpen(false);
    setFormData(defaultState); // Reset form
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-body">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Inventory Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{existingItem ? 'Edit' : 'Add New'} Inventory Item</DialogTitle>
          <DialogDescription className="font-body">
            Fill in the details for the inventory item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-body">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right font-body">Quantity</Label>
            <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right font-body">Unit</Label>
            <Input id="unit" name="unit" value={formData.unit} onChange={handleChange} className="col-span-3 font-body" placeholder="e.g., kg, liter, pcs" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="alertLevel" className="text-right font-body">Alert Level</Label>
            <Input id="alertLevel" name="alertLevel" type="number" value={formData.alertLevel} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vendor" className="text-right font-body">Vendor</Label>
            <Input id="vendor" name="vendor" value={formData.vendor} onChange={handleChange} className="col-span-3 font-body" placeholder="Optional" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-body">Cancel</Button>
            <Button type="submit" className="font-body">{existingItem ? 'Save Changes' : 'Add Item'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
