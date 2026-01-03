
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { getAllUsers, updateUserRole, getVendorsFromFirestore, updateUserPermission, updateUserStatus, updateUserProfile } from '@/app/auth/actions'; // Using Firestore actions
import type { UserProfile, Vendor } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Store, User, Lock, Crown, Check, X, Settings, Ban } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function AdminsPage() {
  const { userProfile: currentUserProfile, authLoading } = useAppContext();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for the settings dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [tempPermissions, setTempPermissions] = useState<{displayName: string, role: UserProfile['role'], vendorCode?: string | null, canUpdateOrderStatus?: boolean, status?: UserProfile['status']}>({});

  const { toast } = useToast();

  const isCurrentUserSuperAdmin = currentUserProfile?.role === 'super-admin';

  const fetchAllData = async () => {
      if (!currentUserProfile || !isCurrentUserSuperAdmin) {
        setDataLoading(false);
        return;
      };

      setDataLoading(true);
      
      const usersResult = await getAllUsers();
      if (usersResult.success && usersResult.data) {
          const filteredUsers = usersResult.data.filter(user => user.uid !== currentUserProfile.uid);
          setUsers(filteredUsers);
      } else if (!usersResult.success) {
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: usersResult.message || "Could not fetch user profiles.",
        });
      }

      const vendorsResult = await getVendorsFromFirestore();
      if (vendorsResult.success && vendorsResult.data) {
        setVendors(vendorsResult.data);
      } else {
         toast({
          variant: "destructive",
          title: "Failed to load vendors",
          description: vendorsResult.error || "Could not fetch vendors.",
        });
      }
      setDataLoading(false);
  };

  useEffect(() => {
    if (!authLoading && isCurrentUserSuperAdmin) {
      fetchAllData();
    } else if (!authLoading) {
      setDataLoading(false);
    }
  }, [authLoading, isCurrentUserSuperAdmin, currentUserProfile?.uid]);


  const openSettingsDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setTempPermissions({
        displayName: user.displayName,
        role: user.role,
        vendorCode: user.vendorCode,
        canUpdateOrderStatus: user.canUpdateOrderStatus,
        status: user.status,
    });
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    
    const profileUpdates: Partial<UserProfile> = {};
    if (selectedUser.displayName !== tempPermissions.displayName) {
        profileUpdates.displayName = tempPermissions.displayName;
    }

    const roleChanged = selectedUser.role !== tempPermissions.role || (tempPermissions.role === 'vendor' && selectedUser.vendorCode !== tempPermissions.vendorCode);
    const permissionChanged = selectedUser.canUpdateOrderStatus !== tempPermissions.canUpdateOrderStatus;
    
    let profileUpdateSuccess = true;
    let roleUpdateSuccess = true;
    let permUpdateSuccess = true;
    
    if (Object.keys(profileUpdates).length > 0) {
        const result = await updateUserProfile(selectedUser.uid, profileUpdates);
         if (!result.success) {
            profileUpdateSuccess = false;
            toast({ variant: "destructive", title: "Profile Update Failed", description: result.message });
        }
    }

    if (roleChanged) {
        const result = await updateUserRole(selectedUser.uid, tempPermissions.role, tempPermissions.vendorCode ?? undefined);
        if (!result.success) {
            roleUpdateSuccess = false;
            toast({ variant: "destructive", title: "Role Update Failed", description: result.message });
        }
    }

    if (permissionChanged) {
        const result = await updateUserPermission(selectedUser.uid, tempPermissions.canUpdateOrderStatus ?? false);
        if (!result.success) {
            permUpdateSuccess = false;
            toast({ variant: "destructive", title: "Permission Update Failed", description: result.message });
        }
    }
    
    if(profileUpdateSuccess && roleUpdateSuccess && permUpdateSuccess) {
        toast({ title: "Settings Saved", description: `${selectedUser.displayName}'s settings have been updated.` });
    }

    await fetchAllData();
    setIsSaving(false);
    setIsDialogOpen(false);
    setSelectedUser(null);
  }

  const handleStatusChange = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    const newStatus = selectedUser.status === 'blocked' ? 'active' : 'blocked';
    const result = await updateUserStatus(selectedUser.uid, newStatus);
    if (result.success) {
        toast({
            title: "Status Updated",
            description: `User has been ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}.`
        });
    } else {
        toast({
            variant: "destructive",
            title: "Status Update Failed",
            description: result.message || "Could not update user status."
        });
    }
    await fetchAllData(); // Refresh users after status change
    setIsSaving(false);
    setIsDialogOpen(false);
    setSelectedUser(null);
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
    <>
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
                    <TableHead className="text-right font-headline">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.uid} 
                      className={cn(
                          "font-body hover:bg-muted/50",
                          user.status === 'blocked' && 'bg-destructive/10 text-muted-foreground'
                      )}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="user avatar"/>
                            <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                             <div className="mt-1.5">{getRoleBadge(user)}</div>
                            {user.status === 'blocked' && <Badge variant="destructive" className="mt-1 text-xs">Blocked</Badge>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon" onClick={() => openSettingsDialog(user)}>
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Open Settings for {user.displayName}</span>
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Settings for {selectedUser?.displayName}</DialogTitle>
                <DialogDescription>
                    Manage permissions, roles, and status for this user.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
                <div className="space-y-6">

                    {/* Display Name Section */}
                    <div className="space-y-3">
                        <Label htmlFor="displayName" className="font-semibold">Display Name</Label>
                        <Input 
                        id="displayName" 
                        value={tempPermissions.displayName || ''} 
                        onChange={(e) => setTempPermissions(prev => ({...prev, displayName: e.target.value}))} 
                        placeholder="Enter user's display name"
                        />
                    </div>

                    <Separator />
                    
                    {/* Permissions Section */}
                    <div className="space-y-3">
                        <Label className="font-semibold">Update Order Status</Label>
                        <p className="text-sm text-muted-foreground">Allow this user to change the status of an order.</p>
                        <div className="inline-flex items-center rounded-md bg-muted p-0.5">
                            <Button
                                variant={tempPermissions.canUpdateOrderStatus ? "default" : "ghost"}
                                size="sm"
                                className={cn("h-8 px-4", tempPermissions.canUpdateOrderStatus && "bg-green-500/80 hover:bg-green-500/90 text-white shadow")}
                                onClick={() => setTempPermissions(prev => ({...prev, canUpdateOrderStatus: true}))}
                            >
                                <Check className="mr-2 h-4 w-4"/> Allow
                            </Button>
                            <Button
                                variant={!tempPermissions.canUpdateOrderStatus ? "default" : "ghost"}
                                size="sm"
                                className={cn("h-8 px-4", !tempPermissions.canUpdateOrderStatus && "bg-red-500/80 hover:bg-red-500/90 text-white shadow")}
                                onClick={() => setTempPermissions(prev => ({...prev, canUpdateOrderStatus: false}))}
                            >
                                <X className="mr-2 h-4 w-4"/> Deny
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Role Section */}
                    <div className="space-y-3">
                        <Label className="font-semibold">User Role</Label>
                        <p className="text-sm text-muted-foreground">Assign a primary role which determines access level.</p>
                        <div className="flex items-center gap-2">
                            <Select
                                value={tempPermissions.role || 'user'}
                                onValueChange={(value) => setTempPermissions(prev => ({...prev, role: value as UserProfile['role']}))}
                                >
                                <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="vendor">Vendor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="super-admin">Super Admin</SelectItem>
                                </SelectContent>
                            </Select>

                            {tempPermissions.role === 'vendor' && (
                                <Select
                                    value={tempPermissions.vendorCode || ''}
                                    onValueChange={(vendorCode) => setTempPermissions(prev => ({...prev, vendorCode}))}
                                    disabled={vendors.length === 0}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Assign Vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vendors.map(vendor => (
                                            <SelectItem key={vendor.id} value={vendor.code}>{vendor.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Status Section */}
                    <div className="space-y-3">
                        <Label className="font-semibold">User Status</Label>
                        <p className="text-sm text-muted-foreground">Block or unblock this user from accessing the application.</p>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            {selectedUser?.status === 'blocked' ? (
                                <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/50">
                                    <Check className="mr-2 h-4 w-4" /> Unblock User
                                </Button>
                            ) : (
                                <Button variant="destructive">
                                    <Ban className="mr-2 h-4 w-4" /> Block User
                                </Button>
                            )}
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You are about to {selectedUser?.status === 'blocked' ? 'unblock' : 'block'} the user: <span className="font-semibold">{selectedUser?.displayName}</span>. 
                                    {selectedUser?.status !== 'blocked' && ' They will be immediately logged out and unable to log in.'}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleStatusChange} disabled={isSaving}>
                                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                    Confirm
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>
            
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Changes
                </Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
