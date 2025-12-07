
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { CustomerTable } from '@/components/customers/customer-table';
import { getAllUsersFromRTDB } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types';
import { Loader2 } from 'lucide-react';

export default function CustomersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const result = await getAllUsersFromRTDB();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: result.message || "Could not fetch user profiles from the database.",
        });
      }
      setIsLoading(false);
    };
    fetchUsers();
  }, [toast]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Customers"
        description="View and manage all registered user profiles."
      />
       {isLoading ? (
          <div className="flex-1 flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
            <CustomerTable users={users} />
          </div>
        )}
    </div>
  );
}
