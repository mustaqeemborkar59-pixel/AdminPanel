
"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, BarChart3, Database, Cable, Loader2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import { Skeleton } from '@/components/ui/skeleton';

// --- SIMULATED BACKEND CALL ---
// In a real application, this function would be a server action
// that securely fetches data from Google Cloud Billing/Usage APIs.
const fetchUsageData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return placeholder data reflecting a NEW USER with 0 usage.
  return {
    plan: 'Standard Plan',
    api: {
      used: 0,
      limit: 500000,
    },
    storage: {
      used: 0, // in GB
      limit: 10, // in GB
    },
    cost: {
      current: 0,
      currency: 'USD'
    },
    breakdown: [
      { service: 'Order Lookups', requests: 0, cost: 0 },
      { service: 'Product Syncs', requests: 0, cost: 0 },
      { service: 'User Management API Calls', requests: 0, cost: 0 },
      { service: 'Real-time Listeners', requests: 0, cost: 0 },
    ]
  };
};


export default function UsagePage() {
  const { userProfile, authLoading } = useAppContext();
  const [usageData, setUsageData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const isVendor = userProfile?.role === 'vendor';

  useEffect(() => {
    // Only fetch data if the user is a vendor.
    if (!authLoading && isVendor) {
      const loadData = async () => {
        setDataLoading(true);
        const data = await fetchUsageData();
        setUsageData(data);
        setDataLoading(false);
      };
      loadData();
    } else if (!authLoading) {
      // If not a vendor, just stop the loading process.
      setDataLoading(false);
    }
  }, [isVendor, authLoading]);

  const apiUsagePercentage = usageData ? (usageData.api.used / usageData.api.limit) * 100 : 0;
  const storageUsagePercentage = usageData ? (usageData.storage.used / usageData.storage.limit) * 100 : 0;
  const goldGradientText = "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500";
  const goldGradientBg = "bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700";

  if (authLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Usage & Billing"
          description="Monitor your API usage, data storage, and monthly costs."
        />
        <div className="flex-1 p-4 md:p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isVendor) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Usage & Billing"
          description="Monitor your API usage, data storage, and monthly costs."
        />
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-center items-center text-center">
          <Lock className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
          <p className="text-muted-foreground mt-2">Only vendors can view this page.</p>
        </div>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader
          title="Usage & Billing"
          description="Monitor your API usage, data storage, and monthly costs."
          actions={<Skeleton className="h-10 w-32" />}
        />
        <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full lg:col-span-2" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 w-full lg:col-span-2" />
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Usage & Billing"
        description="Monitor your API usage, data storage, and monthly costs."
        actions={
          <Button className={cn("text-white", goldGradientBg)}>
            Upgrade Plan <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        }
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-lg">
                <CardHeader className="pb-2">
                    <CardDescription className="font-body">Current Plan</CardDescription>
                    <CardTitle className={cn("text-3xl font-headline", goldGradientText)}>{usageData.plan}</CardTitle>
                </CardHeader>
            </Card>
             <Card className="shadow-lg">
                <CardHeader className="pb-2">
                    <CardDescription className="font-body">Cost This Month</CardDescription>
                    <CardTitle className="text-3xl font-headline">
                        ${usageData.cost.current.toFixed(2)}
                        <span className="text-sm text-muted-foreground ml-1">{usageData.cost.currency}</span>
                    </CardTitle>
                </CardHeader>
            </Card>
            <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center">
                        <Cable className={cn("h-5 w-5 mr-2", goldGradientText)}/> API Requests
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{usageData.api.used.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        of {usageData.api.limit.toLocaleString()} requests used
                    </p>
                    <Progress value={apiUsagePercentage} className="w-full mt-2 h-2" indicatorClassName={goldGradientBg} />
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-lg">
                 <CardHeader>
                    <CardTitle className="font-headline text-lg">Usage Breakdown</CardTitle>
                    <CardDescription>API requests by service for the current billing period.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Service</TableHead>
                                <TableHead className="text-right">API Requests</TableHead>
                                <TableHead className="text-right">Estimated Cost</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usageData.breakdown.map((item: any) => (
                                <TableRow key={item.service}>
                                    <TableCell className="font-medium">{item.service}</TableCell>
                                    <TableCell className="text-right font-mono">{item.requests.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-mono">${item.cost.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-center">
                            <Database className={cn("h-5 w-5 mr-2", goldGradientText)}/> Data Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usageData.storage.used} GB</div>
                        <p className="text-xs text-muted-foreground">
                            of {usageData.storage.limit} GB storage used
                        </p>
                        <Progress value={storageUsagePercentage} className="w-full mt-2 h-2" indicatorClassName={goldGradientBg} />
                    </CardContent>
                </Card>
                <Card className="shadow-lg bg-muted/40">
                    <CardHeader>
                        <CardTitle className="text-base">Need More Power?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Upgrade your plan to get higher limits, priority support, and more.</p>
                        <Button className={cn("w-full text-white", goldGradientBg)}>View All Plans</Button>
                    </CardContent>
                </Card>
            </div>
        </div>

      </div>
    </div>
  );
}
