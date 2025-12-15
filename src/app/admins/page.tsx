
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { getAllUsersFromRTDB, updateUserRoleInRTDB } from '@/app/auth/actions';
import type { UserProfile } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Store, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function AdminsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await getAllUsersFromRTDB();
    if (result.success && result.data) {
      setUsers(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: result.message || "Could not fetch user profiles.",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'vendor' | 'user') => {
    const result = await updateUserRoleInRTDB(userId, newRole);
    if (result.success) {
      toast({
        title: "Role Updated",
        description: "The user's role has been successfully updated.",
      });
      // Refresh the user list to show the new role
      await fetchUsers();
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: result.message || "Could not update the user's role.",
      });
    }
  };

  const getRoleBadge = (role?: 'admin' | 'vendor' | 'user') => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-primary hover:bg-primary"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'vendor':
        return <Badge variant="secondary"><Store className="h-3 w-3 mr-1" />Vendor</Badge>;
      default:
        return <Badge variant="outline"><User className="h-3 w-3 mr-1" />User</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="User Management"
        description="Manage roles and permissions for all application users."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="shadow-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-headline">User</TableHead>
                  <TableHead className="font-headline">Email</TableHead>
                  <TableHead className="font-headline text-center">Current Role</TableHead>
                  <TableHead className="text-right font-headline">Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid} className="font-body hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="user avatar"/>
                          <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <span>{user.displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-right">
                       <Select
                          value={user.role || 'user'}
                          onValueChange={(value) => handleRoleChange(user.uid, value as 'admin' | 'vendor' | 'user')}
                        >
                          <SelectTrigger className="w-[120px] ml-auto h-9">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="vendor">Vendor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}
