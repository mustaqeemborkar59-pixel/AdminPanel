
"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { getOrdersFromWooCommerce, updateOrderStatusInWooCommerce } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Printer, FileDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderListItem } from '@/components/orders/order-list-item';
import { Accordion } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import type { Order, OrderStatus } from '@/types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export default function OrdersPage() {
  const { toast } = useToast();
  const { user, userProfile, authLoading } = useAppContext();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const activePlanId = userProfile?.activePlanId;
  const trialUsed = userProfile?.trialUsed;
  const isPremiumActive = useMemo(() => {
    // Premium if they have an active plan that isn't the trial, OR if they are on trial and haven't used it up.
    return activePlanId !== 'trial' || (activePlanId === 'trial' && !trialUsed);
  }, [activePlanId, trialUsed]);
  
  const canUpdateStatus = useMemo(() => {
    // Only super-admins and users with the specific permission can update status.
    return userProfile?.role === 'super-admin' || userProfile?.canUpdateOrderStatus === true;
  }, [userProfile]);


  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await getOrdersFromWooCommerce();
    if (result.success && result.data) {
      setOrders(result.data);
    } else {
      setError(result.error || "An unknown error occurred.");
      toast({
        variant: "destructive",
        title: "Failed to Fetch Orders",
        description: result.error || "Could not fetch data from WooCommerce.",
      });
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [fetchOrders, authLoading]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    const originalOrders = [...orders];
    
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));

    const result = await updateOrderStatusInWooCommerce(orderId, status);
    if (!result.success) {
      // Revert on failure
      setOrders(originalOrders);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: result.error || `Could not update status for order ${orderId}.`
      });
    } else {
       toast({
        title: "Status Updated",
        description: `Order ${orderId} has been updated to "${status}".`
      });
    }
  };

  const handleToggleSelect = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const formatDateWithTimezone = (date: string | Date): string => {
    if (!date) return 'N/A';
    try {
      const zonedDate = toZonedTime(date, 'Asia/Kolkata');
      return format(zonedDate, "d MMM yyyy, h:mm a");
    } catch(e) {
      return 'Invalid Date';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = orders
      .filter(o => selectedOrders.has(o.id))
      .map(o => [
        o.id,
        o.customerName,
        formatDateWithTimezone(o.timestamp),
        o.status,
        `₹${o.totalAmount.toFixed(2)}`
      ]);

    if (tableData.length === 0) {
      toast({ variant: "destructive", title: "No orders selected" });
      return;
    }

    doc.text("Selected Orders Report", 14, 16);
    (doc as any).autoTable({
      head: [['ID', 'Customer', 'Date', 'Status', 'Total']],
      body: tableData,
      startY: 20
    });
    doc.save('selected_orders.pdf');
  };

  const exportToExcel = () => {
    const selected = orders.filter(o => selectedOrders.has(o.id));
    if (selected.length === 0) {
      toast({ variant: "destructive", title: "No orders selected" });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(selected.map(o => ({
      'Order ID': o.id,
      'Customer Name': o.customerName,
      'Date': formatDateWithTimezone(o.timestamp),
      'Status': o.status,
      'Total': o.totalAmount,
      'Items': o.items.map(i => `${i.name} (x${i.qty})`).join(', ')
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "selected_orders.xlsx");
  };


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Orders"
        description={`Viewing ${orders.length} orders. ${selectedOrders.size} selected.`}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={fetchOrders} variant="outline" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={selectedOrders.size === 0}>
                  <FileDown className="mr-2 h-4 w-4" /> Export ({selectedOrders.size})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Selected As</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={exportToPDF}>PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>Excel (XLSX)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Fetching latest orders...</p>
          </div>
        ) : error ? (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Fetch Error
              </CardTitle>
              <CardDescription className="text-destructive/80">
                There was a problem communicating with the WooCommerce server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Error Details:</p>
              <pre className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-mono">
                {error}
              </pre>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
             {orders.map(order => (
                <OrderListItem
                    key={order.id}
                    value={order.id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                    isSelected={selectedOrders.has(order.id)}
                    onToggleSelect={handleToggleSelect}
                    formatDate={formatDateWithTimezone}
                    userRole={userProfile?.role}
                    isPremiumActive={isPremiumActive}
                    canUpdateStatus={canUpdateStatus}
                />
             ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
