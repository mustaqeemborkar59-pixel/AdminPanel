
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { type Order, type OrderStatus } from '@/types';
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
import { getOrdersFromSheet, updateOrderStatusInSheet } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, ListFilter, Download, FileDown, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


const orderStatuses: OrderStatus[] = ['pending', 'queue', 'processing', 'dispatch', 'completed', 'hold', 'failed', 'cancelled'];
const ITEMS_PER_PAGE = 10;

// New timezone-aware formatting function
function formatDateInIST(dateInput: string | Date): string {
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'Asia/Kolkata' // Explicitly set the timezone to IST
  }).format(date);
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const result = await getOrdersFromSheet();
      if (result.success && result.data) {
        setOrders(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load orders",
          description: result.error || "Could not fetch orders from Google Sheet.",
        });
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [toast]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);


  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const originalOrders = [...orders];
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));

    const result = await updateOrderStatusInSheet(orderId, status);

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

  const filteredOrders = getUniqueOrders(orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    ));
  
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
  
  const generatePdf = (ordersToExport: Order[]) => {
    const doc = new jsPDF();
    const companyDetails = {
      name: "COMPANY",
      address: "Main Street, 00 City, Country 222541",
      phone: "561 123 123",
      email: "yourname@mail.com"
    };

    ordersToExport.forEach((order, index) => {
        if (index > 0) {
            doc.addPage();
        }

        // Header
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', 14, 20);

        // Sub-header details
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('N. INVOICE', 14, 35);
        doc.text('DATE', 50, 35);
        doc.text('PAYMENT METHOD', 86, 35);
        doc.text('AMOUNT DUE', 140, 35);

        doc.setFont('helvetica', 'normal');
        doc.text(order.id, 14, 40);
        // Corrected Date formatting for PDF
        const formattedDate = new Date(order.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
        doc.text(formattedDate, 50, 40);
        doc.text((order.paymentMethod || 'N/A').toUpperCase(), 86, 40);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(145, 63, 42); // Primary color
        doc.text(`₹${order.totalAmount.toFixed(2)}`, 140, 40);
        doc.setTextColor(0, 0, 0); // Reset color


        // Bill From/To
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 14, 55);
        doc.text('BILL FROM:', 86, 55);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const billTo = [
            order.customerName || 'N/A',
            order.shippingAddress || 'No address',
            order.gmail || 'No email'
        ];
        const billFrom = [
            companyDetails.name,
            companyDetails.address,
            companyDetails.email
        ];
        doc.text(billTo, 14, 60);
        doc.text(billFrom, 86, 60);
        
        // Table
        const tableColumn = ["Items", "Quantity", "Price", "Total Amount"];
        const tableRows: (string | number)[][] = [];

        order.items.forEach(item => {
            const itemData = [
            item.name,
            item.qty,
            `₹${item.price.toFixed(2)}`,
            `₹${(item.price * item.qty).toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 85,
            theme: 'plain',
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: { bottom: 0.5 },
                lineColor: [200, 200, 200]
            },
            bodyStyles: {
                lineWidth: { bottom: 0.5 },
                lineColor: [220, 220, 220]
            },
        });

        // Totals
        const finalY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const subtotalX = 140;
        const totalX = 140;
        const textX = 170;

        doc.text('SUBTOTAL', subtotalX, finalY);
        doc.text(`₹${order.subTotal.toFixed(2)}`, textX, finalY, { align: 'right' });
        
        doc.text('TAX (10%)', subtotalX, finalY + 7);
        doc.text(`₹${order.taxAmount.toFixed(2)}`, textX, finalY + 7, { align: 'right' });
        
        doc.line(subtotalX - 5, finalY + 12, textX, finalY + 12);
        
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAL', totalX, finalY + 18);
        doc.text(`₹${order.totalAmount.toFixed(2)}`, textX, finalY + 18, { align: 'right' });

        // Footer
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('THANK YOU!', 14, doc.internal.pageSize.height - 30);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text("The star charts represent the position of the stars as we see them from Earth; however, the stars in\neach constellation may not be close to each other, as some we perceive to be brighter", 14, doc.internal.pageSize.height - 25);
    });

    doc.save(`invoices-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateExcel = (ordersToExport: Order[]) => {
    const worksheetData = ordersToExport.flatMap(order => 
      order.items.map(item => ({
        "Order ID": order.id,
        "Order Status": order.status,
        "Customer Name": order.customerName,
        "Customer Email": order.gmail,
        "Order Date": formatDateInIST(order.timestamp),
        "Product Name": item.name,
        "Quantity": item.qty,
        "Unit Price": item.price,
        "Line Total": item.qty * item.price,
        "Order Subtotal": order.subTotal,
        "Order Tax": order.taxAmount,
        "Order Total": order.totalAmount,
        "Shipping Address": order.shippingAddress,
        "Tracking ID": order.trackingId,
        "Payment Method": order.paymentMethod,
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
      ordersToExport = getUniqueOrders(orders.filter(o => selectedOrderIds.has(o.id)));
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
        description="View and manage customer orders for your online shop from Google Sheets."
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
