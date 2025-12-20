
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { getAllUsers } from '@/app/auth/actions';
import { onValue, ref } from 'firebase/database';
import type { UserProfile } from '@/types';
import { useFirebase } from '@/firebase';
import { Loader2, Lock, Clock, Crown, ShieldCheck, Store, User as UserIcon, CalendarDays, BarChart, Users as UsersIcon, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { UserAnalyticsDetail } from '@/components/analytics/user-analytics-detail';

interface UserPresence {
  state: 'online' | 'offline';
  last_seen: number; 
  time_spent: number; 
}

export interface EnrichedUser extends UserProfile {
  presence?: UserPresence;
}

type GroupedUsers = {
  'super-admin': EnrichedUser[];
  admin: EnrichedUser[];
  vendor: EnrichedUser[];
  user: EnrichedUser[];
};

const ROLE_ORDER: (keyof GroupedUsers)[] = ['super-admin', 'admin', 'vendor', 'user'];
const ROLE_DISPLAY_NAMES: Record<keyof GroupedUsers, string> = {
    'super-admin': 'Super Admins',
    'admin': 'Administrators',
    'vendor': 'Vendors',
    'user': 'Users'
};

const formatTimeSpent = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
};

const getRoleBadge = (user: EnrichedUser) => {
    switch (user.role) {
      case 'super-admin':
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-500 text-xs"><Crown className="h-3 w-3 mr-1" />Super Admin</Badge>;
      case 'admin':
        return <Badge variant="default" className="bg-primary hover:bg-primary text-xs"><ShieldCheck className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'vendor':
        return <Badge variant="secondary" className="text-xs"><Store className="h-3 w-3 mr-1" />Vendor</Badge>;
      default:
        return <Badge variant="outline" className="text-xs"><UserIcon className="h-3 w-3 mr-1" />User</Badge>;
    }
};

const StatsCard = ({ title, value, icon, className }: { title: string; value: string; icon: React.ReactNode; className?: string }) => (
    <Card className={cn("shadow-md", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);


export default function AnalyticsPage() {
  const { rtdb } = useFirebase();
  const { userProfile, authLoading } = useAppContext();
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<EnrichedUser | null>(null);

  const isSuperAdmin = userProfile?.role === 'super-admin';
  const isLoading = dataLoading || authLoading;

  useEffect(() => {
    if (authLoading || !isSuperAdmin) {
        if (!authLoading) setDataLoading(false);
        return;
    }
    
    if (!rtdb) {
        return;
    }

    let isMounted = true;
    let unsubscribe: () => void;

    const fetchAndListen = async () => {
        if (!isMounted) return;
        setDataLoading(true);

        const usersResult = await getAllUsers();
        if (!isMounted) return;

        if (!usersResult.success || !usersResult.data) {
            console.error("Failed to fetch users from Firestore.");
            setDataLoading(false);
            return;
        }
      
        const initialUsers = usersResult.data;
        setUsers(initialUsers);
        setDataLoading(false);

        const statusRef = ref(rtdb, 'status');
        unsubscribe = onValue(statusRef, (snapshot) => {
            if (!isMounted) return;
            
            const presenceData = snapshot.val() as Record<string, UserPresence> | null;
            if (!presenceData) return;
            
            setUsers(currentUsers => 
                currentUsers.map(user => {
                    const userPresence = presenceData[user.uid];
                    return userPresence ? { ...user, presence: userPresence } : user;
                })
            );

        }, (error) => {
            console.error("Error listening to presence data:", error);
        });
    };

    fetchAndListen();

    return () => {
        isMounted = false;
        if (unsubscribe) {
            unsubscribe();
        }
    };
    
  }, [rtdb, isSuperAdmin, authLoading]);
  
  const { onlineCount, groupedUsers } = useMemo(() => {
    const online = users.filter(u => u.presence?.state === 'online').length;
    
    const groups = users.reduce<GroupedUsers>((acc, user) => {
      const role = user.role || 'user';
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(user);
      return acc;
    }, { 'super-admin': [], admin: [], vendor: [], user: [] });

    Object.keys(groups).forEach(role => {
        const key = role as keyof GroupedUsers;
        groups[key].sort((a, b) => {
            const aOnline = a.presence?.state === 'online';
            const bOnline = b.presence?.state === 'online';
            if (aOnline && !bOnline) return -1;
            if (!aOnline && bOnline) return 1;
            return (b.presence?.last_seen || 0) - (a.presence?.last_seen || 0);
        });
    });

    return { onlineCount: online, groupedUsers: groups };
  }, [users]);
  
  if (authLoading) {
    return (
         <div className="flex flex-col h-full">
            <PageHeader
                title="User Analytics"
                description="Track user presence, last seen status, and time spent in the application."
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
          title="User Analytics"
          description="Track user presence, last seen status, and time spent in the application."
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
        title="User Analytics Dashboard"
        description="Live overview of user activity and engagement across the platform."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-6 w-48" />
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-20 w-full" />
                ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard title="Total Users" value={users.length.toString()} icon={<UsersIcon className="text-primary h-5 w-5" />} />
                <StatsCard title="Currently Online" value={onlineCount.toString()} icon={<Wifi className="text-green-500 h-5 w-5" />} />
                <StatsCard title="Offline" value={(users.length - onlineCount).toString()} icon={<WifiOff className="text-red-500 h-5 w-5" />} />
            </div>

            {ROLE_ORDER.map(role => {
                const roleUsers = groupedUsers[role];
                if (roleUsers.length === 0) return null;

                return (
                    <div key={role}>
                        <h2 className="text-xl font-semibold tracking-tight mb-4">{ROLE_DISPLAY_NAMES[role]} ({roleUsers.length})</h2>
                        <div className="space-y-4">
                           {roleUsers.map((user) => (
                              <Card 
                                key={user.uid} 
                                className="shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer"
                                onClick={() => setSelectedUser(user)}
                              >
                                <div className="flex items-center gap-4 p-4">
                                  <div className="relative shrink-0">
                                     <Avatar className="h-12 w-12 border-2 border-primary/50">
                                        <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="user avatar" />
                                        <AvatarFallback className="text-lg">{user.displayName?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                     <span className={cn(
                                        "absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-background",
                                        user.presence?.state === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                     )}/>
                                  </div>
                                  
                                  <div className="flex-grow">
                                     <p className="font-semibold text-base">{user.displayName}</p>
                                     <p className="text-xs text-muted-foreground">{user.email}</p>
                                      <div className="mt-1">
                                        {getRoleBadge(user)}
                                      </div>
                                  </div>

                                  <div className="text-right shrink-0 space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        {user.presence?.state === 'online'
                                        ? <span className="text-green-500 font-bold flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5" />Online</span>
                                        : user.presence?.last_seen
                                        ? `${formatDistanceToNow(fromUnixTime(user.presence.last_seen / 1000), { addSuffix: true })}`
                                        : 'Never'}
                                    </p>
                                     <p className="text-xs font-semibold text-foreground flex items-center justify-end gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        {user.presence?.time_spent ? formatTimeSpent(user.presence.time_spent) : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            ))}
                        </div>
                    </div>
                );
            })}
             {users.length === 0 && !dataLoading && (
                <div className="col-span-full text-center py-12">
                    <p className="font-body text-muted-foreground">No user activity data to display yet.</p>
                </div>
             )}
          </div>
        )}
      </div>
      <UserAnalyticsDetail 
        user={selectedUser} 
        isOpen={!!selectedUser} 
        onOpenChange={(open) => { if(!open) setSelectedUser(null); }}
        formatTimeSpent={formatTimeSpent}
      />
    </div>
  );
}

    