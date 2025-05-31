
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
import { UserPlus } from "lucide-react";
import { type StaffMember } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddStaffMemberDialogProps {
  onAddStaff: (staff: Omit<StaffMember, 'id'>) => void;
  existingStaff?: StaffMember;
  triggerButton?: ReactNode;
}

const defaultState: Omit<StaffMember, 'id'> = {
  name: '',
  role: '',
  shift: '',
  status: 'off-duty',
};

export function AddStaffMemberDialog({ onAddStaff, existingStaff, triggerButton }: AddStaffMemberDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<StaffMember, 'id'>>(defaultState);

  useEffect(() => {
    if (existingStaff && isOpen) { // only update formData if dialog is open and existingStaff is provided
      setFormData({
        name: existingStaff.name,
        role: existingStaff.role,
        shift: existingStaff.shift || '',
        status: existingStaff.status || 'off-duty',
      });
    } else if (!existingStaff && isOpen) { // Reset to default if adding new and dialog opens
      setFormData(defaultState);
    }
  }, [existingStaff, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: keyof Omit<StaffMember, 'id'>, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStaff(formData);
    setIsOpen(false);
    if (!existingStaff) { // Only reset fully if it was an add operation
        setFormData(defaultState);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : 
        <Button className="font-body">
          <UserPlus className="mr-2 h-4 w-4" /> Add Staff Member
        </Button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">{existingStaff ? 'Edit' : 'Add New'} Staff Member</DialogTitle>
          <DialogDescription className="font-body">
            Fill in the details for the staff member. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right font-body">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right font-body">Role</Label>
            <Input id="role" name="role" value={formData.role} onChange={handleChange} className="col-span-3 font-body" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shift" className="text-right font-body">Shift</Label>
            <Input id="shift" name="shift" value={formData.shift} onChange={handleChange} className="col-span-3 font-body" placeholder="e.g., 9 AM - 5 PM" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right font-body">Status</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value as StaffMember['status'])}
            >
              <SelectTrigger className="col-span-3 font-body">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-duty" className="font-body">On Duty</SelectItem>
                <SelectItem value="off-duty" className="font-body">Off Duty</SelectItem>
                <SelectItem value="on-leave" className="font-body">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-body">Cancel</Button>
            <Button type="submit" className="font-body">{existingStaff ? 'Save Changes' : 'Add Staff'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
