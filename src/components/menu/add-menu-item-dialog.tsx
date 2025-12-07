

"use client";

import { useState, useEffect, type ReactNode } from 'react';
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
import { PlusCircle, Edit3 } from "lucide-react";
import { type MenuItem } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { categories as allCategories } from '@/lib/menu-item-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface AddMenuItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveItem: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
  existingItem?: MenuItem;
  /**
   * Optional trigger element. If not provided, a default button is used.
   * If explicitly set to `null`, no trigger is rendered by this component,
   * assuming the dialog is controlled entirely externally.
   */
  trigger?: ReactNode | null;
}

const defaultState: Omit<MenuItem, 'id' | 'imageHint'> = {
  name: '',
  category: 'Fiction',
  price: 0,
  regularPrice: undefined,
  imageUrl: '',
  availability: true,
  description: '',
};

export function AddMenuItemDialog({ isOpen, onOpenChange, onSaveItem, existingItem, trigger }: AddMenuItemDialogProps) {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id' | 'imageHint'>>(defaultState);

  useEffect(() => {
    if (isOpen) {
      if (existingItem) {
        const { id, imageHint, ...editableData } = existingItem;
        setFormData(editableData);
      } else {
        setFormData(defaultState);
      }
    }
  }, [existingItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingItem) {
      onSaveItem({ ...existingItem, ...formData });
    } else {
      onSaveItem(formData);
    }
    onOpenChange(false); // Close dialog via prop
  };
  
  const uniqueCategories = Array.from(new Set(allCategories.filter(c => c.name !== 'All').map(c => c.name)));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger !== null && ( // Only render DialogTrigger if trigger is not explicitly null
        <DialogTrigger asChild>
          {trigger || ( // Default trigger button if `trigger` is undefined (but not null)
            <Button>
              {existingItem ? <Edit3 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {existingItem ? 'Edit Product' : 'Add New Product'}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{existingItem ? 'Edit' : 'Add New'} Product</DialogTitle>
          <DialogDescription>
            Fill in the details for the product. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select name="category" value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Sale Price</Label>
            <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="col-span-3" required min="0" step="0.01" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="regularPrice" className="text-right">Regular Price</Label>
            <Input id="regularPrice" name="regularPrice" type="number" value={formData.regularPrice || ''} onChange={handleChange} className="col-span-3" min="0" step="0.01" placeholder="Optional, for sales"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="col-span-3" placeholder="https://placehold.co/300x200.png"/>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="col-span-3" rows={3} />
          </div>
          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
            <span/> {/* Spacer for alignment */}
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox id="availability" name="availability" checked={formData.availability} onCheckedChange={(checked) => setFormData(prev => ({...prev, availability: Boolean(checked)}))} />
              <Label htmlFor="availability" className="font-normal">In Stock</Label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{existingItem ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
