
import type { UserProfile } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, User, Store, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


interface StaffTableProps {
  users: UserProfile[];
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

export function StaffTable({ users }: StaffTableProps) {
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
            <TableHead className="font-headline text-right">User ID</TableHead>
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
              <TableCell>
                {getRoleBadge(user)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs text-muted-foreground">{user.uid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
