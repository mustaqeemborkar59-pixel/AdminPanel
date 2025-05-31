
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { UserPlus, CalendarDays } from 'lucide-react';
import { type StaffMember } from '@/types';
import { StaffScheduleTable } from '@/components/staff/staff-schedule-table';
import { AddStaffMemberDialog } from '@/components/staff/add-staff-member-dialog';

const initialStaff: StaffMember[] = [
  { id: 'STAFF001', name: 'John Doe', role: 'Chef', shift: '9 AM - 5 PM', status: 'on-duty' },
  { id: 'STAFF002', name: 'Jane Smith', role: 'Waiter', shift: '12 PM - 8 PM', status: 'on-duty' },
  { id: 'STAFF003', name: 'Mike Brown', role: 'Delivery Driver', shift: '10 AM - 6 PM', status: 'off-duty' },
  { id: 'STAFF004', name: 'Emily White', role: 'Manager', shift: '8 AM - 4 PM', status: 'on-leave' },
];


export default function StaffPage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setStaffMembers(initialStaff);
  }, []);

  const handleAddStaff = (newStaff: Omit<StaffMember, 'id'>) => {
    setStaffMembers(prev => [...prev, { ...newStaff, id: `STAFF${String(Date.now()).slice(-4)}` }]);
  };

  const handleEditStaff = (updatedStaff: StaffMember) => {
     setStaffMembers(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffMembers(prev => prev.filter(s => s.id !== staffId));
  };

  if (!isMounted) {
    return null; // Or a loading spinner
  }


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Staff Management"
        description="Manage staff schedules, roles, and attendance."
        actions={
            <AddStaffMemberDialog onAddStaff={handleAddStaff} />
        }
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {/* Placeholder for more advanced scheduling UI */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary"/> Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-body text-muted-foreground">Full scheduling calendar and shift management interface will be here.</p>
          </CardContent>
        </Card> */}
        
        <StaffScheduleTable 
            staffMembers={staffMembers} 
            onEditStaff={handleEditStaff} 
            onDeleteStaff={handleDeleteStaff}
        />
      </div>
    </div>
  );
}
