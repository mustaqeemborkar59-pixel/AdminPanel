
"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { getAllUsers } from '@/app/auth/actions';
import { getDatabase, ref, onValue } from 'firebase/database';
import type { UserProfile } from '@/types';
import { useFirebase } from '@/firebase';
import { Loader2, User, UserCheck, UserX, Lock, Clock, Crown, ShieldCheck, Store, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


interface UserPresence {
  state: 'online' | 'offline';
  last_seen: number; // Firebase Server Timestamp
  time_spent: number; // in seconds
}

interface EnrichedUser extends UserProfile {
  presence?: UserPresence;
}

// Function to format seconds into a readable string
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
        return <Badge variant="outline" className="text-xs"><User className="h-3 w-3 mr-1" />User</Badge>;
    }
};


export default function AnalyticsPage() {
  const { rtdb } = useFirebase();
  const { userProfile, authLoading } = useAppContext();
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const isSuperAdmin = userProfile?.role === 'super-admin';
  const isLoading = dataLoading || authLoading;

  useEffect(() => {
    if (authLoading || !isSuperAdmin) {
        if (!authLoading) setDataLoading(false);
        return;
    }
    
    // Only proceed if rtdb is available
    if (!rtdb) {
        if(!isLoading) setDataLoading(true); // Ensure loading is true if rtdb is not ready
        return;
    }

    let isMounted = true;
    
    const fetchAndListen = async () => {
        if (isMounted) setDataLoading(true);

        const usersResult = await getAllUsers();
        if (!isMounted) return;

        if (!usersResult.success || !usersResult.data) {
            console.error("Failed to fetch users from Firestore.");
            setDataLoading(false);
            return;
        }
      
        const initialUsers = usersResult.data;
        // Initially set users without presence data
        setUsers(initialUsers);

        const statusRef = ref(rtdb, 'status');

        const unsubscribe = onValue(statusRef, (snapshot) => {
            if (!isMounted) return;
            
            const presenceData = snapshot.val() as Record<string, UserPresence> | null;
            
            setUsers(currentUsers => currentUsers.map(user => {
                 const userPresence = presenceData ? presenceData[user.uid] : undefined;
                 return { ...user, presence: userPresence };
            }));
            
            setDataLoading(false);

        }, (error) => {
            console.error("Error listening to presence data:", error);
            if (isMounted) setDataLoading(false);
        });

        return () => {
            unsubscribe();
        };
    };

    const cleanupPromise = fetchAndListen();

    return () => {
        isMounted = false;
        cleanupPromise.then(cleanup => {
            if (cleanup) cleanup();
        });
    };
    
  }, [rtdb, isSuperAdmin, authLoading]);
  
  const sortedUsers = useMemo(() => {
     return [...users].sort((a, b) => {
        const aOnline = a.presence?.state === 'online';
        const bOnline = b.presence?.state === 'online';
        if (aOnline && !bOnline) return -1;
        if (!aOnline && bOnline) return 1;
        // If both are offline, sort by most recently seen
        if(!aOnline && !bOnline) {
            return (b.presence?.last_seen || 0) - (a.presence?.last_seen || 0);
        }
        // If both online, sort by name
        return (a.displayName || '').localeCompare(b.displayName || '');
     });
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
        title="User Analytics"
        description="Track user presence, last seen status, and time spent in the application."
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="flex flex-col shadow-lg">
                  <CardHeader className="flex flex-col items-center text-center p-4">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <Skeleton className="h-6 w-32 mt-3" />
                      <Skeleton className="h-4 w-40 mt-1" />
                      <Skeleton className="h-5 w-20 mt-2" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-end">
                      <div className="space-y-3">
                          <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-12" />
                          </div>
                           <div className="flex items-center justify-between">
                               <Skeleton className="h-4 w-20" />
                               <Skeleton className="h-4 w-16" />
                          </div>
                      </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedUsers.map((user) => (
              <Card key={user.uid} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-col items-center text-center p-4">
                  <div className="relative">
                     <Avatar className="h-20 w-20 border-2 border-primary/50">
                        <AvatarImage src={user.photoURL} alt={user.displayName} data-ai-hint="user avatar" />
                        <AvatarFallback className="text-2xl">{user.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                     <span className={cn(
                        "absolute bottom-0 right-0 block h-5 w-5 rounded-full border-2 border-background",
                        user.presence?.state === 'online' ? 'bg-green-500' : 'bg-gray-400'
                     )}/>
                  </div>
                  <CardTitle className="mt-3 text-lg font-semibold">{user.displayName}</CardTitle>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                   <div className="mt-2">
                    {getRoleBadge(user)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-end">
                    <div className="space-y-3 text-sm text-foreground/80">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center text-muted-foreground">
                                <Clock className="h-4 w-4 mr-2" />
                                Time Spent
                            </span>
                            <span className="font-semibold text-foreground">
                                {user.presence?.time_spent ? formatTimeSpent(user.presence.time_spent) : 'N/A'}
                            </span>
                        </div>
                         <div className="flex items-center justify-between">
                            <span className="flex items-center text-muted-foreground">
                                <CalendarDays className="h-4 w-4 mr-2" />
                                Last Seen
                            </span>
                            <span className="font-semibold text-foreground">
                                {user.presence?.state === 'online'
                                ? <span className="text-green-500">Online</span>
                                : user.presence?.last_seen
                                ? `${formatDistanceToNow(fromUnixTime(user.presence.last_seen / 1000), { addSuffix: true })}`
                                : 'Never'}
                            </span>
                        </div>
                    </div>
                </CardContent>
              </Card>
            ))}
             {sortedUsers.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <p className="font-body text-muted-foreground">No user activity data to display yet.</p>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
