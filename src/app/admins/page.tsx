
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { getAllUsers, updateUserRole } from '@/app/auth/actions'; // Using Firestore actions
import { getVendorsFromRTDB } from '@/app/vendors/actions';
import type { UserProfile, Vendor } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Store, User, Lock, Crown } from 'lucide-react';
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
import { useAppContext } from '@/components/layout/app-content-wrapper';

export default function AdminsPage() {
  const { userProfile: currentUserProfile, authLoading } = useAppContext();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { toast } = useToast();

  const isCurrentUserSuperAdmin = currentUserProfile?.role === 'super-admin';

  useEffect(() => {
    if (!authLoading && isCurrentUserSuperAdmin) {
      const fetchInitialData = async () => {
        setDataLoading(true);
        
        const usersResult = await getAllUsers(); // Firestore action
        if (usersResult.success && usersResult.data && currentUserProfile) {
            const filteredUsers = usersResult.data.filter(user => user.uid !== currentUserProfile.uid);
            setUsers(filteredUsers);
        } else if (!usersResult.success) {
          toast({
            variant: "destructive",
            title: "Failed to load users",
            description: usersResult.message || "Could not fetch user profiles.",
          });
        }

        const vendorsResult = await getVendorsFromRTDB();
        if (vendorsResult.success && vendorsResult.data) {
          setVendors(vendorsResult.data);
        } else {
           toast({
            variant: "destructive",
            title: "Failed to load vendors",
            description: vendorsResult.message || "Could not fetch vendors.",
          });
        }

        setDataLoading(false);
      };
      
      fetchInitialData();
    } else if (!authLoading && !isCurrentUserSuperAdmin) {
        setDataLoading(false);
    }
  }, [authLoading, isCurrentUserSuperAdmin, currentUserProfile, toast]);


  const handleRoleChange = async (userId: string, newRole: 'admin' | 'vendor' | 'user' | 'super-admin', vendorCode?: string) => {
    const result = await updateUserRole(userId, newRole, vendorCode); // Firestore action
    if (result.success) {
      toast({
        title: "Role Updated",
        description: "The user's role has been successfully updated.",
      });
      const usersResult = await getAllUsers(); // Firestore action
       if (usersResult.success && usersResult.data && currentUserProfile) {
            const filteredUsers = usersResult.data.filter(user => user.uid !== currentUserProfile.uid);
            setUsers(filteredUsers);
        }
    } else {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: result.message || "Could not update the user's role.",
      });
    }
  };

  const getRoleBadge = (user: UserProfile) => {
    switch (user.role) {
      case 'super-admin':
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-500"><Crown className="h-3 w-3 mr-1" />Super Admin</Badge>;
      case 'admin':
        return <Badge variant="default" className="bg-primary hover:bg-primary"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'vendor':
        const vendorName = vendors.find(v => v.code === user.vendorCode)?.name || user.vendorCode;
        return <Badge variant="secondary"><Store className="h-3 w-3 mr-1" />Vendor ({vendorName})</Badge>;
      default:
        return <Badge variant="outline"><User className="h-3 w-3 mr-1" />User</Badge>;
    }
  };
  
  if (authLoading) {
      return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="User Management"
                description="Manage roles and permissions for all application users."
            />
            <div className="flex-1 p-4 md:p-6 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
      );
  }
  
  if (!isCurrentUserSuperAdmin) {
    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="User Management"
                description="Manage roles and permissions for all application users."
            />
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center items-center text-center">
                <Lock className="h-16 w-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
                <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="User Management"
        description="Manage roles and permissions for all application users."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {dataLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="shadow-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-headline">User</TableHead>
                  <TableHead className="font-headline text-center">Current Role</TableHead>
                  <TableHead className="text-right font-headline">Change Role / Assign Vendor</TableHead>
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
                        <div>
                          <span>{user.displayName}</span>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{getRoleBadge(user)}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end items-center gap-2">
                         {user.role === 'vendor' && (
                            <Select
                                value={user.vendorCode || ''}
                                onValueChange={(vendorCode) => handleRoleChange(user.uid, 'vendor', vendorCode)}
                                disabled={vendors.length === 0}
                            >
                                <SelectTrigger className="w-[180px] h-9">
                                    <SelectValue placeholder="Assign Vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendors.map(vendor => (
                                        <SelectItem key={vendor.id} value={vendor.code}>{vendor.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         )}
                         <Select
                            value={user.role || 'user'}
                            onValueChange={(value) => handleRoleChange(user.uid, value as 'admin' | 'vendor' | 'user' | 'super-admin', user.vendorCode)}
                          >
                            <SelectTrigger className="w-[140px] ml-auto h-9">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="vendor">Vendor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super-admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
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
