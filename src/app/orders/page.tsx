
"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { updateOrderStatusInWooCommerce } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, FileDown, Search, Calendar as CalendarIcon, X as XIcon, PackageSearch, Clock, Loader, Truck, CheckCircle, Archive, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { OrderListItem } from '@/components/orders/order-list-item';
import { Accordion } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import type { Order, OrderStatus } from '@/types';
import type { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


const statusInfo: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: PackageSearch, color: 'bg-yellow-500', label: 'Pending' },
  queue: { icon: Clock, color: 'bg-blue-500', label: 'In Queue' },
  processing: { icon: Loader, color: 'bg-purple-500', label: 'Processing' },
  dispatch: { icon: Truck, color: 'bg-indigo-500', label: 'Dispatched' },
  completed: { icon: CheckCircle, color: 'bg-green-500', label: 'Completed' },
  hold: { icon: Archive, color: 'bg-orange-500', label: 'On Hold' },
  failed: { icon: XCircle, color: 'bg-red-500', label: 'Failed' },
  cancelled: { icon: XCircle, color: 'bg-red-600', label: 'Cancelled' },
};


export default function OrdersPage() {
  const { toast } = useToast();
  const { user, userProfile, authLoading } = useAppContext();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('any');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const activePlanId = userProfile?.activePlanId;
  const trialUsed = userProfile?.trialUsed;
  const isPremiumActive = useMemo(() => {
    return activePlanId !== 'trial' || (activePlanId === 'trial' && !trialUsed);
  }, [activePlanId, trialUsed]);
  
  const canUpdateStatus = useMemo(() => {
    return userProfile?.role === 'super-admin' || userProfile?.canUpdateOrderStatus === true;
  }, [userProfile]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const params = new URLSearchParams();
    if (debouncedSearchTerm) {
      params.append('search', debouncedSearchTerm);
    }
    if (statusFilter !== 'any') {
      params.append('status', statusFilter);
    }
    if (dateRange?.from) {
      params.append('after', dateRange.from.toISOString());
    }
    if (dateRange?.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Include the whole day
      params.append('before', toDate.toISOString());
    }

    try {
      const response = await fetch(`/api/orders?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data: Order[] = await response.json();
      
      // Group sub-orders under their parents
      const orderMap = new Map<string, Order>();
      data.forEach(order => {
        orderMap.set(order.id, { ...order, subOrders: [] });
      });

      const rootOrders: Order[] = [];
      data.forEach(order => {
        const orderIdStr = String(order.id);
        if (order.parentId && order.parentId !== 0) {
          const parentIdStr = String(order.parentId);
          const parent = orderMap.get(parentIdStr);
          if (parent && parent.subOrders) {
            parent.subOrders.push(orderMap.get(orderIdStr)!);
          } else {
             // It's a sub-order whose parent is not in this batch, treat it as a root order.
             rootOrders.push(orderMap.get(orderIdStr)!);
          }
        } else {
          // It's a root order.
          rootOrders.push(orderMap.get(orderIdStr)!);
        }
      });

      setOrders(rootOrders);

    } catch (err: any) {
       const errorMessage = err.message || "An unknown error occurred.";
       setError(errorMessage);
       toast({
        variant: "destructive",
        title: "Failed to Fetch Orders",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, debouncedSearchTerm, statusFilter, dateRange]);

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [fetchOrders, authLoading]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    const originalOrders = [...orders];
    setOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));

    const result = await updateOrderStatusInWooCommerce(orderId, status);
    if (!result.success) {
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

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('any');
    setDateRange(undefined);
  }

  const formatDateWithTimezone = (date: string | Date): string => {
    if (!date) return 'N/A';
    try {
      const zonedDate = toZonedTime(date, 'Asia/Kolkata');
      return format(zonedDate, "d MMM yyyy, h:mm a");
    } catch(e) {
      return 'Invalid Date';
    }
  };

  const exportToPDF = (ordersToExport: Order[]) => {
    if (ordersToExport.length === 0) {
      toast({ variant: "destructive", title: "No Orders to Export", description: "There are no orders to export for the selected criteria." });
      return;
    }
    const doc = new jsPDF();
    const tableData = ordersToExport.map(o => [
        o.id,
        o.customerName,
        formatDateWithTimezone(o.timestamp),
        o.status,
        `₹${o.totalAmount.toFixed(2)}`
      ]);

    doc.text("Orders Report", 14, 16);
    (doc as any).autoTable({
      head: [['ID', 'Customer', 'Date', 'Status', 'Total']],
      body: tableData,
      startY: 20
    });
    doc.save('orders_report.pdf');
  };

  const exportToExcel = (ordersToExport: Order[]) => {
     if (ordersToExport.length === 0) {
        toast({ variant: "destructive", title: "No Orders to Export", description: "There are no orders to export for the selected criteria." });
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(ordersToExport.map(o => ({
      'Order ID': o.id,
      'Customer Name': o.customerName,
      'Date': formatDateWithTimezone(o.timestamp),
      'Status': o.status,
      'Total': o.totalAmount,
      'Items': o.items.map(i => `${i.name} (x${i.qty})`).join(', ')
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "orders_report.xlsx");
  };

  const selectedOrdersData = useMemo(() => {
    return orders.filter(o => selectedOrders.has(o.id));
  }, [orders, selectedOrders]);


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Orders"
        description={`Viewing ${orders.length} filtered orders. ${selectedOrders.size} selected.`}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={fetchOrders} variant="outline" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={selectedOrders.size === 0}>
                    Export Selected ({selectedOrders.size})
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => exportToPDF(selectedOrdersData)}>
                        PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToExcel(selectedOrdersData)}>
                        Excel (XLSX)
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={orders.length === 0}>
                     Export Filtered ({orders.length})
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => exportToPDF(orders)}>
                        PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToExcel(orders)}>
                        Excel (XLSX)
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />
      
      {/* Filters Bar */}
      <div className="p-4 md:px-6 border-b bg-muted/30">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:w-auto md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by ID, name, email, phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All Statuses</SelectItem>
              {Object.keys(statusInfo).map(s => (
                <SelectItem key={s} value={s} className="capitalize">{statusInfo[s as OrderStatus].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-[280px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
             <XIcon className="mr-2 h-4 w-4" />
             Clear
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Fetching orders...</p>
          </div>
        ) : error ? (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle /> Fetch Error
              </CardTitle>
              <CardDescription className="text-destructive/80">
                There was a problem communicating with the server.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Error Details:</p>
              <pre className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-mono">
                {error}
              </pre>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg font-semibold">No Orders Found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
          </div>
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
