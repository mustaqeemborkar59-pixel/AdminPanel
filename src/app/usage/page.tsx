
"use client";

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
import { ArrowUpRight, BarChart3, Database, Cable } from 'lucide-react';
import { cn } from '@/lib/utils';

// Placeholder data - replace with actual data from your backend/service
const usageData = {
  plan: 'Standard Plan',
  api: {
    used: 125340,
    limit: 500000,
  },
  storage: {
    used: 2.7, // in GB
    limit: 10, // in GB
  },
  cost: {
    current: 19.99,
    currency: 'USD'
  },
  breakdown: [
    { service: 'Order Lookups', requests: 75230, cost: 9.50 },
    { service: 'Product Syncs', requests: 35110, cost: 5.49 },
    { service: 'User Management API Calls', requests: 12500, cost: 3.00 },
    { service: 'Real-time Listeners', requests: 2500, cost: 2.00 },
  ]
};

export default function UsagePage() {

  const apiUsagePercentage = (usageData.api.used / usageData.api.limit) * 100;
  const storageUsagePercentage = (usageData.storage.used / usageData.storage.limit) * 100;
  const goldGradientText = "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500";
  const goldGradientBg = "bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700";

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
                            {usageData.breakdown.map((item) => (
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
