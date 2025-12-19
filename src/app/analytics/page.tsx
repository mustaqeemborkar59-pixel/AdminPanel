"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { getAllUsers } from '@/app/auth/actions';
import { getDatabase, ref, onValue } from 'firebase/database';
import type { UserProfile } from '@/types';
import { useFirebase } from '@/firebase';
import { Loader2, User, UserCheck, UserX } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';

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
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};


export default function AnalyticsPage() {
  const { rtdb } = useFirebase(); // Use hook to get RTDB instance
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndPresence = async () => {
      setIsLoading(true);
      
      // 1. Fetch all user profiles from Firestore
      const usersResult = await getAllUsers();
      if (!usersResult.success || !usersResult.data) {
        console.error("Failed to fetch users");
        setIsLoading(false);
        return;
      }
      const initialUsers: EnrichedUser[] = usersResult.data;

      // 2. Set up a listener for the entire /status node in RTDB
      if (rtdb) {
        const statusRef = ref(rtdb, 'status');
        onValue(statusRef, (snapshot) => {
          const presenceData = snapshot.val() as Record<string, UserPresence> | null;
          
          // 3. Enrich user profiles with presence data
          const enrichedUsers = initialUsers.map(user => {
            const userPresence = presenceData ? presenceData[user.uid] : undefined;
            return { ...user, presence: userPresence };
          });
          
          setUsers(enrichedUsers);
        });
      }

      setIsLoading(false);
    };

    fetchUsersAndPresence();

    // The `onValue` listener will keep the data updated.
    // The listener is automatically removed by Firebase when the component unmounts.
  }, [rtdb]);

  const getStatusBadge = (user: EnrichedUser) => {
    if (user.presence?.state === 'online') {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-500/90">
          <UserCheck className="h-3 w-3 mr-1" />
          Online
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        <UserX className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  };
  
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
        return a.displayName.localeCompare(b.displayName);
     });
  }, [users]);


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="User Analytics"
        description="Track user presence, last seen status, and time spent in the application."
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
                  <TableHead className="font-headline text-center">Status</TableHead>
                  <TableHead className="font-headline text-center">Time Spent</TableHead>
                  <TableHead className="text-right font-headline">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
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
                    <TableCell className="text-center">{getStatusBadge(user)}</TableCell>
                    <TableCell className="text-center">
                        {user.presence?.time_spent ? formatTimeSpent(user.presence.time_spent) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.presence?.state === 'online'
                        ? 'Now'
                        : user.presence?.last_seen
                        ? `${formatDistanceToNow(fromUnixTime(user.presence.last_seen / 1000), { addSuffix: true })}`
                        : 'Never'}
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
