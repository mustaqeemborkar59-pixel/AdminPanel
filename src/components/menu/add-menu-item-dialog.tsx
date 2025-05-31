
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { type MenuItem } from '@/types';

interface AddMenuItemDialogProps {
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  existingItem?: MenuItem;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  triggerButton?: ReactNode; // Optional custom trigger
}

const defaultState = {
  name: '',
  category: '',
  price: 0,
  description: '',
  imageUrl: 'https://placehold.co/300x200.png', // Default placeholder
  imageHint: 'food item', // Default hint
  availability: true,
};

export function AddMenuItemDialog({ 
  onAddItem, 
  existingItem, 
  isOpen, 
  setIsOpen, 
  triggerButton 
}: AddMenuItemDialogProps) {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>(defaultState);

  useEffect(() => {
    if (isOpen) {
      if (existingItem) {
        setFormData({
          name: existingItem.name,
          category: existingItem.category,
          price: existingItem.price,
          description: existingItem.description || '',
          imageUrl: existingItem.imageUrl || 'https://placehold.co/300x200.png',
          imageHint: existingItem.imageHint || 'food item',
          availability: existingItem.availability,
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [existingItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, availability: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(formData);
    setIsOpen(false); 
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{existingItem ? 'Edit' : 'Add New'} Menu Item</DialogTitle>
          <DialogDescription className="font-body">
            Fill in the details for the menu item. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-body">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right font-body">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right font-body">Price</Label>
            <Input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right font-body">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3 font-body" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right font-body">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="col-span-3 font-body" placeholder="https://placehold.co/300x200.png"/>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageHint" className="text-right font-body">Image Hint</Label>
            <Input id="imageHint" name="imageHint" value={formData.imageHint} onChange={handleChange} className="col-span-3 font-body" placeholder="e.g. pizza cheese"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="availability" className="text-right font-body">Available</Label>
            <Switch id="availability" name="availability" checked={formData.availability} onCheckedChange={handleSwitchChange} className="col-span-3" />
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
