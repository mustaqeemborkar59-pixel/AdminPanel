
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Loader2, Lock } from 'lucide-react';
import type { UserProfile } from '@/types';
import { StaffTable } from '@/components/staff/staff-table';
import { getAllUsers, updateUserStatus } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/components/layout/app-content-wrapper';


export default function StaffPage() {
  const { userProfile, authLoading } = useAppContext();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();

  const isSuperAdmin = userProfile?.role === 'super-admin';
  
  const fetchUsers = async () => {
    setDataLoading(true);
    const result = await getAllUsers();
    if (result.success && result.data) {
      // Filter out the current super admin from the list
      const filteredUsers = result.data.filter(u => u.uid !== userProfile?.uid);
      setUsers(filteredUsers);
    } else {
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: result.message || "Could not fetch user data.",
      });
    }
    setDataLoading(false);
  };

  useEffect(() => {
    if (!authLoading && isSuperAdmin) {
      fetchUsers();
    } else if (!authLoading && !isSuperAdmin) {
      setDataLoading(false);
    }
  }, [authLoading, isSuperAdmin, userProfile]);

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'blocked') => {
      const result = await updateUserStatus(userId, newStatus);
      if (result.success) {
          toast({
              title: "Status Updated",
              description: `User has been ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}.`
          });
          await fetchUsers(); // Refresh users after status change
      } else {
          toast({
              variant: "destructive",
              title: "Status Update Failed",
              description: result.message || "Could not update user status."
          });
      }
  };
  
  if (authLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Staff Management"
          description="View all users in the system and manage their status."
        />
        <div className="flex-1 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Staff Management"
          description="View all users in the system and manage their status."
        />
        <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
            <Lock className="h-16 w-16 text-destructive mb-4" />
            <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
            <p className="text-muted-foreground mt-2">Only Super Admins can access this page.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Staff Management"
        description="View all users in the system and manage their status."
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {dataLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <StaffTable users={users} onStatusChange={handleStatusChange}/>
        )}
      </div>
    </div>
  );
}
