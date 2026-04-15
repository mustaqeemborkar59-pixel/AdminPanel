
"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { updateOrderStatusInWooCommerce } from './actions';
import { useToast } from '@/hooks/use-toast';
import { getVendorsFromFirestore } from '@/app/auth/actions';
import { Loader2, AlertTriangle, FileDown, Search, Calendar as CalendarIcon, X as XIcon, PackageSearch, Clock, Loader, Truck, CheckCircle, Archive, XCircle, Store } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { useAppContext } from '@/components/layout/app-content-wrapper';
import type { Order, OrderStatus, Vendor } from '@/types';
import type { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';


const statusInfo: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: PackageSearch, color: 'bg-yellow-500', label: 'Pending' },
  queue: { icon: Clock, color: 'bg-blue-500', label: 'In Queue' },
  processing: { icon: Loader, color: 'bg-purple-500', label: 'Processing' },
  dispatch: { icon: Truck, color: 'bg-indigo-500', label: 'Dispatched' },
  'in-transit': { icon: Truck, color: 'bg-cyan-500', label: 'In Transit' },
  completed: { icon: CheckCircle, color: 'bg-green-500', label: 'Completed' },
  hold: { icon: Archive, color: 'bg-orange-500', label: 'On Hold' },
  failed: { icon: XCircle, color: 'bg-red-500', label: 'Failed' },
  cancelled: { icon: XCircle, color: 'bg-red-600', label: 'Cancelled' },
};


export default function OrdersPage() {
  const { toast } = useToast();
  const { user, userProfile, authLoading } = useAppContext();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('any');
  const [vendorFilter, setVendorFilter] = useState('any');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  // States for date picker confirmation
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // This effect runs once on component mount to set the initial date range safely on the client-side.
    // It avoids hydration errors caused by server/client date mismatch.
    const today = new Date();
    setDateRange({ from: startOfDay(today), to: endOfDay(today) });
    setTempDateRange({ from: startOfDay(today), to: endOfDay(today) });
  }, []);

  const activePlanId = userProfile?.activePlanId;
  const trialUsed = userProfile?.trialUsed;
  const isPremiumActive = useMemo(() => {
    return activePlanId !== 'trial' || (activePlanId === 'trial' && !trialUsed);
  }, [activePlanId, trialUsed]);
  
  const canUpdateStatus = useMemo(() => {
    return userProfile?.role === 'super-admin' || userProfile?.canUpdateOrderStatus === true;
  }, [userProfile]);

  const handleApplySearch = () => {
    setAppliedSearchTerm(searchTerm);
  };
  
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleApplySearch();
    }
  };

  const fetchAllData = useCallback(async () => {
    // Do not fetch if date range is not set yet (during initial client-side hydration)
    if (!dateRange?.from) {
        return;
    }
    setIsLoading(true);
    setError(null);
    
    // Fetch Vendors first (or in parallel)
    if (userProfile?.role === 'admin' || userProfile?.role === 'super-admin' || userProfile?.role === 'vendor') {
      const vendorsResult = await getVendorsFromFirestore();
      if (vendorsResult.success && vendorsResult.data) {
        setVendors(vendorsResult.data);
      } else {
         toast({
          variant: "destructive",
          title: "Failed to load vendors",
          description: vendorsResult.error || "Could not fetch vendors.",
        });
      }
    }

    const baseParams = new URLSearchParams();
    if (appliedSearchTerm) {
      baseParams.append('search', appliedSearchTerm);
    }
    baseParams.append('status', statusFilter === 'any' ? 'any' : statusFilter);
    
    // --- NEW FETCHING LOGIC ---
    // Fetch a wider range of data from the API based on creation date.
    // This ensures we get older orders that might have been paid within the selected range.
    if (dateRange?.from) {
      const fromDate = subDays(dateRange.from, 30); // Fetch last 30 days of data prior to start
      baseParams.append('after', format(startOfDay(fromDate), "yyyy-MM-dd'T'HH:mm:ss"));
    }
    if (dateRange?.to) {
      baseParams.append('before', format(endOfDay(dateRange.to), "yyyy-MM-dd'T'HH:mm:ss"));
    }

    try {
      let allOrders: Order[] = [];
      let page = 1;
      let keepFetching = true;
      
      while (keepFetching) {
        const params = new URLSearchParams(baseParams);
        params.append('page', page.toString());
        
        const response = await fetch(`/api/orders?${params.toString()}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }

        const data: Order[] = await response.json();
        allOrders = allOrders.concat(data);

        if (data.length < 100) {
          keepFetching = false; // Stop if we received less than 100 orders, meaning it's the last page
        } else {
          page++; // Go to the next page
        }
      }
      
      const orderMap = new Map<string, Order>();
      allOrders.forEach(order => {
        orderMap.set(order.id, { ...order, subOrders: [] });
      });

      const rootOrders: Order[] = [];
      allOrders.forEach(order => {
        const orderIdStr = String(order.id);
        if (order.parentId && order.parentId !== 0) {
          const parentIdStr = String(order.parentId);
          const parent = orderMap.get(parentIdStr);
          if (parent && parent.subOrders) {
            parent.subOrders.push(orderMap.get(orderIdStr)!);
          } else {
             rootOrders.push(orderMap.get(orderIdStr)!);
          }
        } else {
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
  }, [toast, appliedSearchTerm, statusFilter, dateRange, userProfile?.role]);

  useEffect(() => {
    if (!authLoading && dateRange) {
      fetchAllData();
    }
  }, [fetchAllData, authLoading, dateRange]);

  const ordersFilteredByDate = useMemo(() => {
    let ordersToFilter: Order[] = [...orders];

    if (dateRange?.from) {
      const toDate = dateRange.to || dateRange.from;
      ordersToFilter = ordersToFilter.filter(order => {
        const effectiveDate = order.paymentDate ? new Date(order.paymentDate) : new Date(order.timestamp);
        return effectiveDate >= startOfDay(dateRange.from!) && effectiveDate <= endOfDay(toDate);
      });
    }

    return ordersToFilter;
  }, [orders, dateRange]);

  const vendorOrderCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    if (userProfile?.role === 'vendor') {
        return {};
    }
    ordersFilteredByDate.forEach(order => {
        const orderVendors = new Set(order.items.map(i => i.vendorName).filter(Boolean));
        orderVendors.forEach(vendorCode => {
            counts[vendorCode as string] = (counts[vendorCode as string] || 0) + 1;
        });
    });
    return counts;
  }, [ordersFilteredByDate, userProfile?.role]);

  const displayedOrders = useMemo(() => {
    let ordersToDisplay = [...ordersFilteredByDate];
    
    if (userProfile?.role === 'vendor' && userProfile.vendorCode) {
      return ordersToDisplay.map(order => {
          const vendorItems = order.items.filter(item => item.vendorName === userProfile.vendorCode);
          if (vendorItems.length === 0) return null;

          const subTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
          const taxRatio = order.subTotal > 0 ? order.taxAmount / order.subTotal : 0;
          const taxAmount = subTotal * taxRatio;
          const totalAmount = subTotal + taxAmount;
          return { ...order, items: vendorItems, subTotal, taxAmount, totalAmount };
      }).filter((order): order is Order => order !== null);
    }
    
    if ((userProfile?.role === 'admin' || userProfile?.role === 'super-admin') && vendorFilter !== 'any') {
      return ordersToDisplay.map(order => {
          const vendorItems = order.items.filter(item => item.vendorName === vendorFilter);
          if (vendorItems.length === 0) return null;
          
          const subTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
          const taxRatio = order.subTotal > 0 ? order.taxAmount / order.subTotal : 0;
          const taxAmount = subTotal * taxRatio;
          const totalAmount = subTotal + taxAmount;
          return { ...order, items: vendorItems, subTotal, taxAmount, totalAmount };
      }).filter((order): order is Order => order !== null);
    }
    
    return ordersToDisplay;
  }, [ordersFilteredByDate, userProfile, vendorFilter]);


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
    setAppliedSearchTerm('');
    setStatusFilter('any');
    setVendorFilter('any');
    
    const today = new Date();
    const initialRange = { from: startOfDay(today), to: endOfDay(today) };
    setDateRange(initialRange);
    setTempDateRange(initialRange);
  }

  const handleDateApply = () => {
    setDateRange(tempDateRange);
    setIsDatePickerOpen(false);
  };
  
  const handleDateCancel = () => {
    // No need to reset tempDateRange, it will be synced on next open
    setIsDatePickerOpen(false);
  };

  const handleDatePickerOpenChange = (open: boolean) => {
    if (open) {
      // When opening, sync temp state with the currently applied main state
      setTempDateRange(dateRange);
    }
    setIsDatePickerOpen(open);
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

  const getFilename = () => {
      const base = 'Orders-Report';
      let vendorName = '';
      if(userProfile?.role === 'vendor' && userProfile.vendorCode) {
          vendorName = vendors.find(v => v.code === userProfile.vendorCode)?.name || userProfile.vendorCode;
      } else if (vendorFilter !== 'any') {
          vendorName = vendors.find(v => v.code === vendorFilter)?.name || vendorFilter;
      }
      
      let dateString = '';
      if(dateRange?.from && dateRange?.to) {
          if (format(dateRange.from, 'yyyy-MM-dd') === format(dateRange.to, 'yyyy-MM-dd')) {
              dateString = format(dateRange.from, 'dd-MM-yy');
          } else {
              dateString = `${format(dateRange.from, 'dd-MM-yy')}_to_${format(dateRange.to, 'dd-MM-yy')}`;
          }
      } else if (dateRange?.from) {
          dateString = format(dateRange.from, 'dd-MM-yy');
      }

      return `${base}${vendorName ? `_${vendorName.replace(/ /g, '-')}` : ''}${dateString ? `_${dateString}`: ''}`;
  }


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
    doc.save(`${getFilename()}.pdf`);
  };

  const exportToExcel = (ordersToExport: Order[]) => {
    if (ordersToExport.length === 0) {
      toast({
        variant: "destructive",
        title: "No Orders to Export",
        description: "There are no orders to export for the selected criteria."
      });
      return;
    }

    const vendorMap = new Map(vendors.map(v => [v.code, v.name]));

    const flattenedData = ordersToExport.flatMap(order => {
      if (order.items.length === 0) {
        return [{
          'Order ID': order.id,
          'Status': order.status,
          'Payment Date': order.paymentDate ? formatDateWithTimezone(order.paymentDate) : 'N/A',
          'Customer Name': order.customerName,
          'Email ID': order.gmail,
          'Phone': order.phone,
          'Alt Phone': order.altPhone,
          'Pincode': order.pincode,
          'Billing Address': order.billingAddress,
          'Product Name': 'N/A',
          'Quantity': 0,
          'Unit Price': 0,
          'Line Total': 0,
          'Vendor': 'N/A',
          'Order Total': order.totalAmount,
        }];
      }
      return order.items.map(item => ({
        'Order ID': order.id,
        'Status': order.status,
        'Payment Date': order.paymentDate ? formatDateWithTimezone(order.paymentDate) : 'N/A',
        'Customer Name': order.customerName,
        'Email ID': order.gmail,
        'Phone': order.phone,
        'Alt Phone': order.altPhone,
        'Pincode': order.pincode,
        'Billing Address': order.billingAddress,
        'Product Name': item.name,
        'Quantity': item.qty,
        'Unit Price': item.price,
        'Line Total': item.qty * item.price,
        'Vendor': (item.vendorName ? vendorMap.get(item.vendorName) : undefined) || item.vendorName || 'N/A',
        'Order Total': order.totalAmount,
      }));
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `${getFilename()}.xlsx`);
  };

  const selectedOrdersData = useMemo(() => {
    return displayedOrders.filter(o => selectedOrders.has(o.id));
  }, [displayedOrders, selectedOrders]);


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Manage Orders"
        description={`Viewing ${displayedOrders.length} filtered orders. ${selectedOrders.size} selected.`}
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={fetchAllData} variant="outline" disabled={isLoading}>
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
                  <DropdownMenuSubTrigger disabled={displayedOrders.length === 0}>
                     Export Filtered ({displayedOrders.length})
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => exportToPDF(displayedOrders)}>
                        PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportToExcel(displayedOrders)}>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search by ID, name, email, phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
             <Button onClick={handleApplySearch}>Search</Button>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All Statuses</SelectItem>
              {Object.keys(statusInfo).map(s => (
                <SelectItem key={s} value={s} className="capitalize">{statusInfo[s as OrderStatus].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(userProfile?.role === 'admin' || userProfile?.role === 'super-admin') && (
             <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger className="w-full">
                 <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by vendor" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">All Vendors</SelectItem>
                {vendors.map(v => (
                  <SelectItem key={v.id} value={v.code}>
                     <div className="flex w-full justify-between items-center">
                        <span>{v.name}</span>
                        <Badge variant="secondary" className="ml-2 rounded-sm px-1.5 font-normal">
                           {vendorOrderCounts[v.code] || 0}
                        </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
           <Popover open={isDatePickerOpen} onOpenChange={handleDatePickerOpenChange}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
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
                defaultMonth={tempDateRange?.from}
                selected={tempDateRange}
                onSelect={setTempDateRange}
                numberOfMonths={isMobile ? 1 : 2}
              />
              <div className="flex justify-end gap-2 p-2 border-t">
                  <Button variant="ghost" size="sm" onClick={handleDateCancel}>Cancel</Button>
                  <Button size="sm" onClick={handleDateApply}>Apply</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground lg:col-start-5">
             <XIcon className="mr-2 h-4 w-4" />
             Clear Filters
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 md:p-6 overflow-auto flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Fetching data...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-2xl border-destructive bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-destructive">
                  <AlertTriangle className="h-8 w-8" />
                  Connection Failed
                </CardTitle>
                <CardDescription className="text-destructive/90">
                  The application could not connect to your WooCommerce store to fetch orders. This is usually due to missing or incorrect API settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-foreground">Error Details:</p>
                  <pre className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive font-mono whitespace-pre-wrap">
                    {error}
                  </pre>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-foreground mb-2">How to Fix This:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>
                      Open the <code className="font-mono bg-muted px-1.5 py-0.5 rounded">.env</code> file from the file explorer on the left.
                    </li>
                    <li>
                      Fill in the correct values for your WooCommerce store:
                      <ul className="list-disc list-inside ml-4 mt-2 font-mono text-xs text-foreground bg-background p-3 rounded-md border">
                        <li>WOOCOMMERCE_STORE_URL=...</li>
                        <li>WOOCOMMERCE_CONSUMER_KEY=...</li>
                        <li>WOOCOMMERCE_CONSUMER_SECRET=...</li>
                      </ul>
                    </li>
                    <li>After saving the <code className="font-mono bg-muted px-1.5 py-0.5 rounded">.env</code> file, click the button below to try again.</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter>
                  <Button onClick={fetchAllData} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Retry Connection
                  </Button>
              </CardFooter>
            </Card>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
            <p className="text-lg font-semibold">No Orders Found</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
             {displayedOrders.map(order => (
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

