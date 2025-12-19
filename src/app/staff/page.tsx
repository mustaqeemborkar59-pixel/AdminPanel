"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { UserPlus, Loader2 } from 'lucide-react';
import type { UserProfile } from '@/types';
import { StaffTable } from '@/components/staff/staff-table';
import { getAllUsers } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';


export default function StaffPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const result = await getAllUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: result.message || "Could not fetch user data.",
        });
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, [toast]);


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Staff Management"
        description="View all users in the system. Manage roles in the Admins section."
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <StaffTable users={users} />
        )}
      </div>
    </div>
  );
}
