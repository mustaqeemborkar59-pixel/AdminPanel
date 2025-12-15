
"use client";
import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { type Order, type OrderItem, type OrderStatus, type Vendor, type UserProfile } from '@/types';
import { OrderListItem } from '@/components/orders/order-list-item';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { getOrdersFromWooCommerce, updateOrderStatusInWooCommerce } from './actions';
import { getCompanyDetailsFromRTDB } from '@/app/auth/actions';
import { getVendorsFromRTDB } from '@/app/vendors/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, ListFilter, Download, FileDown, FileText, FileSpreadsheet, Calendar as CalendarIcon, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { addDays, format, type DateRange } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAppContext } from '@/components/layout/app-content-wrapper';


const orderStatuses: OrderStatus[] = ['pending', 'queue', 'processing', 'dispatch', 'completed', 'hold', 'failed', 'cancelled'];
const ITEMS_PER_PAGE = 10;

// New timezone-aware formatting function
function formatDateInIST(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return 'N/A';
  const date = new Date(dateInput);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'Asia/Kolkata'
  };
  
  const formattedParts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date);
  const day = formattedParts.find(p => p.type === 'day')?.value;
  const month = formattedParts.find(p => p.type === 'month')?.value;
  const year = formattedParts.find(p => p.type === 'year')?.value;

  return `${day} ${month}, ${year}`;
}

export default function OrdersPage() {
  const { userProfile } = useAppContext(); // Get user profile from context
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [vendorFilter, setVendorFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const [allVendors, setAllVendors] = useState<string[]>([]);
  const [vendorMap, setVendorMap] = useState<Map<string, string>>(new Map());

  const isVendor = userProfile?.role === 'vendor';


  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);

      const vendorsResult = await getVendorsFromRTDB();
      if(vendorsResult.success && vendorsResult.data) {
        const newVendorMap = new Map(vendorsResult.data.map(v => [v.code, v.name]));
        setVendorMap(newVendorMap);
      } else if (!vendorsResult.success) {
         toast({
          variant: "destructive",
          title: "Failed to load vendors",
          description: vendorsResult.error || "Could not fetch vendors from the database.",
        });
      }
      
      const ordersResult = await getOrdersFromWooCommerce();
      if (ordersResult.success && ordersResult.data) {
        setOrders(ordersResult.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load orders",
          description: ordersResult.error || "Could not fetch orders from WooCommerce.",
        });
      }

      setIsLoading(false);
    };
    fetchInitialData();
  }, [toast]);
  
  useEffect(() => {
     if (orders.length > 0) {
        const vendorCodes = new Set(
          orders.flatMap(order => order.items.map(item => item.vendorName).filter(Boolean) as string[])
        );
        // Now map codes to names, falling back to code if name not found
        const vendorDisplayNames = Array.from(vendorCodes).map(code => vendorMap.get(code) || code);
        setAllVendors(vendorDisplayNames);
    }
  }, [orders, vendorMap]);


  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm, dateRange, vendorFilter]);


  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const originalOrders = [...orders];
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));

    const result = await updateOrderStatusInWooCommerce(orderId, status);

    if (!result.success) {
      setOrders(originalOrders);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: result.error || "Could not update the order status.",
      });
    } else {
       toast({
        title: "Order Updated",
        description: `Order ${orderId} status set to ${status}.`,
      });
    }
  };

  const getUniqueOrders = (orderArray: Order[]): Order[] => {
    const seen = new Set<string>();
    return orderArray.filter(order => {
      if (seen.has(order.id)) {
        return false;
      }
      seen.add(order.id);
      return true;
    });
  };

  const filteredOrders = useMemo(() => {
    
    // Vendor Role Filtering Logic
    const currentVendorCode = isVendor ? userProfile?.vendorCode : null;
    let vendorFilteredOrders = orders;
    
    if (currentVendorCode) {
        // If the user is a vendor, first filter the orders to only include those with their items.
        vendorFilteredOrders = orders.map(order => {
            const vendorItems = order.items.filter(item => item.vendorName === currentVendorCode);
            if (vendorItems.length === 0) {
                return null; // This order doesn't belong to the vendor
            }
            // Recalculate totals based on only the vendor's items in the order
            const subTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const taxRatio = order.subTotal > 0 ? order.taxAmount / order.subTotal : 0;
            const taxAmount = subTotal * taxRatio;
            const totalAmount = subTotal + taxAmount;
            return { ...order, items: vendorItems, subTotal, taxAmount, totalAmount };
        }).filter((order): order is Order => order !== null);
    }


    let filtered = vendorFilteredOrders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order => {
        if (isVendor) return true; // Vendor dropdown is hidden, so this filter is bypassed
        if (vendorFilter === 'all') return true;
        // Check if any item's vendor name (from map) or code matches the filter
        return order.items.some(item => {
            if (!item.vendorName) return false;
            const displayName = vendorMap.get(item.vendorName) || item.vendorName;
            return displayName === vendorFilter;
        });
    })
    .map(order => {
        if (isVendor) return order; // Vendor orders are already processed
        if (vendorFilter === 'all') return order;
        // If an admin selects a vendor, filter the items within the order
        const vendorItems = order.items.filter(item => {
          if (!item.vendorName) return false;
          const displayName = vendorMap.get(item.vendorName) || item.vendorName;
          return displayName === vendorFilter;
        });

        // Recalculate totals based on filtered items
        const subTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
        // Assuming a proportional tax calculation. This might need adjustment based on real tax rules.
        const taxRatio = order.subTotal > 0 ? order.taxAmount / order.subTotal : 0;
        const taxAmount = subTotal * taxRatio;
        const totalAmount = subTotal + taxAmount;
        
        return { 
            ...order, 
            items: vendorItems,
            // Overwrite totals for this filtered view
            subTotal,
            taxAmount,
            totalAmount,
        };
    })
    .filter(order => order.items.length > 0) // Ensure order still has items after vendor filter
    .filter(order => {
      if (!dateRange?.from) return true; // No start date, no filter
      
      const dateStringToFilter = order.paymentDate || order.timestamp;
      const orderDateInIST = new Date(new Date(dateStringToFilter).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);

      // If only `from` is selected, treat `to` as the same day
      const toDate = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
      toDate.setHours(23, 59, 59, 999);

      return orderDateInIST >= fromDate && orderDateInIST <= toDate;
    })
    .filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return getUniqueOrders(filtered);
  }, [orders, statusFilter, vendorFilter, dateRange, searchTerm, vendorMap, userProfile, isVendor]);
  
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.size === paginatedOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(paginatedOrders.map(o => o.id)));
    }
  };
  
  const generatePdf = async (ordersToExport: Order[]) => {
    const doc = new jsPDF();
    const dbDetailsResult = await getCompanyDetailsFromRTDB();

    const companyDetails = dbDetailsResult.success && dbDetailsResult.data ? dbDetailsResult.data : {
        companyName: "Your Company",
        address: "123 Business Rd, Suite 100",
        city: "Your City, State, 12345",
        email: "contact@yourcompany.com"
    };

    ordersToExport.forEach((originalOrder, index) => {
        if (index > 0) {
            doc.addPage();
        }

        // IMPORTANT: Recalculate totals based on vendor if a filter is active
        // The `originalOrder` from `filteredOrders` already has recalculated values if a vendor is selected.
        // So we can use its values directly.
        const order = originalOrder;

        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        const margin = 10;
        let yPos = 20;

        // Header
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;

        // Company & Order Details
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(companyDetails.companyName, margin, yPos);
        doc.text(companyDetails.address, margin, yPos + 6);
        doc.text(companyDetails.city, margin, yPos + 12);

        doc.setFont('helvetica', 'bold');
        doc.text('Order ID:', pageWidth - 70, yPos, { align: 'left' });
        doc.text('Date:', pageWidth - 70, yPos + 7, { align: 'left' });
        doc.text('Status:', pageWidth - 70, yPos + 14, { align: 'left' });

        doc.setFont('helvetica', 'normal');
        doc.text(order.id, pageWidth - margin, yPos, { align: 'right' });
        doc.text(formatDateInIST(order.timestamp), pageWidth - margin, yPos + 7, { align: 'right' });
        doc.text(order.status, pageWidth-margin, yPos + 14, {align: 'right'})
        yPos += 24;
        
        // Line Separator
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;

        // Bill To
        const lineSpacing = 6;
        const valueXOffset = 25;
        const maxContentWidth = (pageWidth - margin * 2) * 0.8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', margin, yPos);
        yPos += lineSpacing;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        doc.setFont('helvetica', 'bold');
        doc.text('Name:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(order.customerName || 'N/A', margin + valueXOffset, yPos);
        yPos += lineSpacing;

        doc.setFont('helvetica', 'bold');
        doc.text('Address:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        const addressLines = doc.splitTextToSize(order.billingAddress || 'No address provided', maxContentWidth);
        doc.text(addressLines, margin + valueXOffset, yPos);
        yPos += addressLines.length * (lineSpacing - 2); // Adjust spacing for multiline text
        
        doc.setFont('helvetica', 'bold');
        doc.text('Pincode:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(order.pincode || '', margin + valueXOffset, yPos);
        yPos += lineSpacing;
        
        doc.setFont('helvetica', 'bold');
        doc.text('Phone:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(order.phone || 'N/A', margin + valueXOffset, yPos);
        yPos += lineSpacing;
        
        if (order.altPhone) {
          doc.setFont('helvetica', 'bold');
          doc.text('Alt Phone:', margin, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(order.altPhone, margin + valueXOffset, yPos);
          yPos += lineSpacing;
        }

        doc.setFont('helvetica', 'bold');
        doc.text('Email:', margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(order.gmail || 'N/A', margin + valueXOffset, yPos);
        yPos += lineSpacing;


        // Table
        const tableColumn = ["ITEM", "QUANTITY", "PRICE", "TOTAL"];
        const tableRows: (string | number)[][] = [];

        order.items.forEach(item => {
            const itemData = [
                item.name,
                item.qty,
                `₹${item.price.toFixed(0)}`,
                `₹${(item.price * item.qty).toFixed(0)}`
            ];
            tableRows.push(itemData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: yPos + 5, // Start table after BILL TO section
            theme: 'striped',
            headStyles: {
                fillColor: [52, 73, 94], // Dark blue-gray
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            styles: {
                font: 'helvetica',
                fontSize: 10,
            },
            margin: { left: margin, right: margin }
        });

        // Totals at the bottom
        let finalY = (doc as any).lastAutoTable.finalY || yPos + 5;
        if (finalY > pageHeight - 60) {
            doc.addPage();
            finalY = 20;
        }

        const subtotalX = pageWidth - 80;
        const textX = pageWidth - margin;
        const totalY = finalY + 20;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        doc.text('Subtotal:', subtotalX, totalY, { align: 'right' });
        doc.text(`₹${order.subTotal.toFixed(0)}`, textX, totalY, { align: 'right' });
        
        doc.text(`Tax (${(order.subTotal > 0 ? (order.taxAmount / order.subTotal) * 100 : 0).toFixed(0)}%):`, subtotalX, totalY + 7, { align: 'right' });
        doc.text(`₹${order.taxAmount.toFixed(0)}`, textX, totalY + 7, { align: 'right' });
        
        doc.setDrawColor(40, 40, 40);
        doc.line(subtotalX - 5, totalY + 12, textX, totalY + 12);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL:', subtotalX, totalY + 18, { align: 'right' });
        doc.text(`₹${order.totalAmount.toFixed(0)}`, textX, totalY + 18, { align: 'right' });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Thank you for business with Sakib Truth!', margin, pageHeight - 20);
    });

    const dateStr = new Date().toISOString().split('T')[0];
    let fileName = `invoices-${dateStr}.pdf`;
    if (vendorFilter !== 'all') {
        const safeVendorName = vendorFilter.replace(/[^a-zA-Z0-9]/g, '_');
        fileName = `${safeVendorName}_invoices-${dateStr}.pdf`;
    }
    doc.save(fileName);
  };

  const generateExcel = (ordersToExport: Order[]) => {
    const worksheetData = ordersToExport.flatMap(order => 
      order.items.map(item => ({
        "Order ID": order.id,
        "Status": order.status,
        "Payment Date": formatDateInIST(order.paymentDate),
        "Customer Name": order.customerName || 'N/A',
        "Email ID": order.gmail || 'N/A',
        "Phone": order.phone || 'N/A',
        "Alt Phone": order.altPhone || 'N/A',
        "Pincode": order.pincode || 'N/A',
        "Billing Address": order.billingAddress || 'N/A',
        "Product Name": item.name,
        "Quantity": item.qty,
        "Unit Price": item.price,
        "Line Total": item.qty * item.price,
        "Vendor": vendorMap.get(item.vendorName || '') || item.vendorName || 'N/A',
        "Order Total": order.totalAmount,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders-${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  const handleExport = (format: 'pdf' | 'excel', scope: 'selected' | 'all') => {
    let ordersToExport: Order[] = [];

    if (scope === 'selected') {
      if (selectedOrderIds.size === 0) {
        toast({
          variant: 'destructive',
          title: 'No Orders Selected',
          description: 'Please select at least one order to export.',
        });
        return;
      }
      // Use the already filtered and recalculated orders
      ordersToExport = filteredOrders.filter(o => selectedOrderIds.has(o.id));
    } else { // 'all'
      if (filteredOrders.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Orders Found',
          description: 'There are no orders matching the current filters to export.',
        });
        return;
      }
      ordersToExport = filteredOrders;
    }

    if (format === 'pdf') {
      generatePdf(ordersToExport);
    } else { // 'excel'
      generateExcel(ordersToExport);
    }
  };


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Order Management"
        description="View and manage customer orders from your WooCommerce store."
      />
      <div className="px-4 md:px-6 pt-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Order ID or Customer Name..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[260px] justify-start text-left font-normal",
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto capitalize">
                <ListFilter className="mr-2 h-4 w-4" />
                {statusFilter === 'all' ? 'Filter by Status' : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Order Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {orderStatuses.map(status => (
                  <DropdownMenuRadioItem key={status} value={status} className="capitalize">{status}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {!isVendor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto" disabled={allVendors.length === 0}>
                  <Building className="mr-2 h-4 w-4" />
                  {vendorFilter === 'all' ? 'Filter by Vendor' : vendorFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Vendor</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={vendorFilter} onValueChange={setVendorFilter}>
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  {allVendors.map(vendor => (
                    <DropdownMenuRadioItem key={vendor} value={vendor}>{vendor}</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>Export Selected</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleExport('pdf', 'selected')} disabled={selectedOrderIds.size === 0}>
                      <FileText className="mr-2 h-4 w-4"/>
                      <span>As PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('excel', 'selected')} disabled={selectedOrderIds.size === 0}>
                      <FileSpreadsheet className="mr-2 h-4 w-4"/>
                      <span>As Excel</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

               <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>Export All Filtered</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleExport('pdf', 'all')}>
                      <FileText className="mr-2 h-4 w-4"/>
                      <span>As PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('excel', 'all')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4"/>
                      <span>As Excel</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : paginatedOrders.length > 0 ? (
          <>
            <div className="flex items-center gap-2 px-1 py-2">
                <Checkbox
                    id="select-all"
                    checked={selectedOrderIds.size > 0 && selectedOrderIds.size === paginatedOrders.length && paginatedOrders.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all orders on this page"
                />
                <Label htmlFor="select-all" className="text-sm font-medium text-muted-foreground">
                    Select All on Page
                </Label>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {paginatedOrders.map((order, index) => (
                <OrderListItem 
                  key={`${order.id}-${startIndex + index}`} 
                  order={order} 
                  onUpdateStatus={handleUpdateOrderStatus} 
                  value={`${order.id}-${startIndex + index}`}
                  isSelected={selectedOrderIds.has(order.id)}
                  onToggleSelect={toggleSelectOrder}
                  formatDate={formatDateInIST}
                />
              ))}
            </Accordion>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="font-body text-muted-foreground">No orders found matching your criteria.</p>
          </div>
        )}
      </div>

       {totalPages > 1 && (
        <div className="flex items-center justify-center p-4 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

    

    

