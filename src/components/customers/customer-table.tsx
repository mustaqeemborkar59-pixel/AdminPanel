
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CustomerTableProps {
  users: UserProfile[];
}

export function CustomerTable({ users }: CustomerTableProps) {
  if (!users || users.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No users found.</div>
  }
  
  return (
    <Card className="shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>UID</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                     <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="user avatar"/>
                     <AvatarFallback>{user.displayName?.[0] || user.email?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.displayName || 'N/A'}</span>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone || 'N/A'}</TableCell>
              <TableCell className="font-mono text-xs">{user.uid}</TableCell>
              <TableCell>{user.address || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
