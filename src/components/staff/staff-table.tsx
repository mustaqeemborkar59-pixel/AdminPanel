
import type { UserProfile } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User, Store, Crown, Ban, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';


interface StaffTableProps {
  users: UserProfile[];
  onStatusChange: (userId: string, newStatus: 'active' | 'blocked') => void;
}

const getRoleBadge = (user: UserProfile) => {
    switch (user.role) {
      case 'super-admin':
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-500"><Crown className="h-3 w-3 mr-1" />Super Admin</Badge>;
      case 'admin':
        return <Badge variant="default" className="bg-primary hover:bg-primary"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'vendor':
        return <Badge variant="secondary"><Store className="h-3 w-3 mr-1" />Vendor</Badge>;
      default:
        return <Badge variant="outline"><User className="h-3 w-3 mr-1" />User</Badge>;
    }
};

export function StaffTable({ users, onStatusChange }: StaffTableProps) {
  if (users.length === 0) {
    return <div className="text-center py-12 font-body text-muted-foreground">No users found.</div>;
  }

  return (
    <Card className="shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-headline">User</TableHead>
            <TableHead className="font-headline">Email</TableHead>
            <TableHead className="font-headline">Role</TableHead>
            <TableHead className="font-headline text-right">Actions</TableHead>
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
                        <span>{user.displayName}</span>
                        {user.status === 'blocked' && <Badge variant="destructive" className="mt-1 text-xs">Blocked</Badge>}
                    </div>
                 </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {getRoleBadge(user)}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                      {user.status === 'blocked' ? (
                        <Button variant="outline" size="sm" className="bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800">
                          <CheckCircle className="mr-2 h-4 w-4" /> Unblock
                        </Button>
                      ) : (
                        <Button variant="destructive" size="sm">
                          <Ban className="mr-2 h-4 w-4" /> Block
                        </Button>
                      )}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You are about to {user.status === 'blocked' ? 'unblock' : 'block'} the user: <span className="font-semibold">{user.displayName}</span>. 
                          {user.status !== 'blocked' && ' They will be unable to log in.'}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onStatusChange(user.uid, user.status === 'blocked' ? 'active' : 'blocked')}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
