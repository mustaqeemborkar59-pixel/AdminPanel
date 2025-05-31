
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
import { initialMenuItems, categories as allCategories } from '@/lib/menu-item-data'; // For categories list
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


interface AddMenuItemDialogProps {
  onSaveItem: (item: Omit<MenuItem, 'id'> | MenuItem) => void;
  existingItem?: MenuItem;
  trigger?: ReactNode;
}

const defaultState: Omit<MenuItem, 'id' | 'imageHint'> = {
  name: '',
  category: allCategories[1]?.name || 'Appetizers', // Default to first actual category
  price: 0,
  imageUrl: '',
  availability: true,
  description: '',
  isVegetarian: false,
  discount: 0,
};

export function AddMenuItemDialog({ onSaveItem, existingItem, trigger }: AddMenuItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<MenuItem, 'id' | 'imageHint'>>(defaultState);

  useEffect(() => {
    if (isOpen) {
      if (existingItem) {
        // Don't include id or imageHint if they are not part of the form directly
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
    setIsOpen(false);
  };
  
  const uniqueCategories = Array.from(new Set(allCategories.filter(c => c.name !== 'All').map(c => c.name)));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button >
            {existingItem ? <Edit3 className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {existingItem ? 'Edit Item' : 'Add New Item'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{existingItem ? 'Edit' : 'Add New'} Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details for the menu item. Click save when you're done.
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
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="col-span-3" required min="0" step="0.01" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="col-span-3" placeholder="https://placehold.co/300x200.png"/>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="col-span-3" rows={3} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">Discount (%)</Label>
            <Input id="discount" name="discount" type="number" value={formData.discount || 0} onChange={handleChange} className="col-span-3" min="0" max="100" />
          </div>
          <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
            <span/> {/* Spacer for alignment */}
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox id="availability" name="availability" checked={formData.availability} onCheckedChange={(checked) => setFormData(prev => ({...prev, availability: Boolean(checked)}))} />
              <Label htmlFor="availability" className="font-normal">Available</Label>
            </div>
            <span/> {/* Spacer for alignment */}
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox id="isVegetarian" name="isVegetarian" checked={formData.isVegetarian} onCheckedChange={(checked) => setFormData(prev => ({...prev, isVegetarian: Boolean(checked)}))} />
              <Label htmlFor="isVegetarian" className="font-normal">Vegetarian</Label>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">{existingItem ? 'Save Changes' : 'Add Item'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
