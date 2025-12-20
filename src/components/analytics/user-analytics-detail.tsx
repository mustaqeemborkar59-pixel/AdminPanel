
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { EnrichedUser } from "@/app/analytics/page";
import { cn } from "@/lib/utils";
import { Clock, CalendarDays, Mail, ShieldCheck, Store, Crown, User as UserIcon, Fingerprint, Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

interface UserAnalyticsDetailProps {
  user: EnrichedUser | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formatTimeSpent: (seconds: number) => string;
}

const getRoleInfo = (role: EnrichedUser['role']) => {
    switch (role) {
      case 'super-admin':
        return { icon: Crown, label: 'Super Admin', className: "text-amber-500" };
      case 'admin':
        return { icon: ShieldCheck, label: 'Admin', className: "text-primary" };
      case 'vendor':
        return { icon: Store, label: 'Vendor', className: "text-blue-500" };
      default:
        return { icon: UserIcon, label: 'User', className: "text-muted-foreground" };
    }
};

export function UserAnalyticsDetail({ user, isOpen, onOpenChange, formatTimeSpent }: UserAnalyticsDetailProps) {
  if (!user) {
    return null;
  }
  
  const RoleIcon = getRoleInfo(user.role).icon;
  const roleLabel = getRoleInfo(user.role).label;
  const roleColor = getRoleInfo(user.role).className;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card">
        <DialogHeader className="text-center items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/60">
              <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="user avatar"/>
              <AvatarFallback className="text-3xl">{user.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <span className={cn(
                "absolute bottom-1 right-1 block h-6 w-6 rounded-full border-2 border-background",
                user.presence?.state === 'online' ? 'bg-green-500' : 'bg-gray-400'
            )}/>
          </div>
          <DialogTitle className="text-2xl font-bold mt-3">{user.displayName}</DialogTitle>
          <DialogDescription>
            <span className={cn("font-semibold flex items-center justify-center gap-1.5", roleColor)}>
                <RoleIcon className="h-4 w-4" /> {roleLabel}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>
             <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Fingerprint className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="font-semibold">User ID</p>
                    <p className="text-muted-foreground font-mono text-xs">{user.uid}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                {user.presence?.state === 'online' ? 
                    <Wifi className="h-5 w-5 text-green-500" /> : 
                    <WifiOff className="h-5 w-5 text-red-500" />
                }
                <div className="text-sm">
                    <p className="font-semibold">Status</p>
                    <p className={cn("font-bold", user.presence?.state === 'online' ? "text-green-500" : "text-red-500")}>
                        {user.presence?.state === 'online' ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="font-semibold">Total Time Spent</p>
                    <p className="text-muted-foreground">{user.presence?.time_spent ? formatTimeSpent(user.presence.time_spent) : 'No activity recorded'}</p>
                </div>
            </div>
             <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                    <p className="font-semibold">Last Seen</p>
                    <p className="text-muted-foreground">
                        {user.presence?.state === 'online'
                        ? 'Active now'
                        : user.presence?.last_seen
                        ? `${formatDistanceToNow(fromUnixTime(user.presence.last_seen / 1000), { addSuffix: true })}`
                        : 'Never seen'}
                    </p>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
