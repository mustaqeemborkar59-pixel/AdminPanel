
"use client";
import { useState, useEffect, useRef } from 'react';
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
} from "@/components/ui/dropdown-menu";
import { getOrdersFromSheet, updateOrderStatusInSheet } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search, ListFilter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { useReactToPrint } from 'react-to-print';
import { OrderInvoicesForPrint } from '@/components/orders/order-invoices-for-print';


const orderStatuses: OrderStatus[] = ['pending', 'queue', 'processing', 'dispatch', 'completed', 'hold', 'failed', 'cancelled'];
const ITEMS_PER_PAGE = 5;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [ordersToPrint, setOrdersToPrint] = useState<Order[]>([]);
  
  const printComponentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle: 'invoices',
    onAfterPrint: () => setOrdersToPrint([]), // Clear the orders to print after printing
  });

  const triggerPrint = (orders: Order[]) => {
    setOrdersToPrint(orders);
    // Use a short timeout to allow the state to update and the component to re-render
    setTimeout(() => {
      handlePrint();
    }, 100);
  };
  

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
  
  // Reset to page 1 whenever the filter or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistically update UI
    const originalOrders = [...orders];
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));

    const result = await updateOrderStatusInSheet(orderId, status);

    if (!result.success) {
      // Revert UI on failure
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

  const filteredOrders = orders
    .filter(order => statusFilter === 'all' || order.status === statusFilter)
    .filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
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
  
  const handleExportSelected = () => {
    const selectedOrders = orders.filter(o => selectedOrderIds.has(o.id));
    if (selectedOrders.length > 0) {
      triggerPrint(selectedOrders);
    } else {
      toast({
        variant: 'destructive',
        title: 'No Orders Selected',
        description: 'Please select at least one order to export.',
      });
    }
  };

  const handleExportAllFiltered = () => {
    if (filteredOrders.length > 0) {
      triggerPrint(filteredOrders);
    } else {
      toast({
        variant: 'destructive',
        title: 'No Orders Found',
        description: 'There are no orders matching the current filters to export.',
      });
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
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={handleExportSelected} disabled={selectedOrderIds.size === 0}>
                Export Selected to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportAllFiltered}>
                Export All Filtered to PDF
              </DropdownMenuItem>
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
                    checked={selectedOrderIds.size > 0 && selectedOrderIds.size === paginatedOrders.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all orders on this page"
                />
                <Label htmlFor="select-all" className="text-sm font-medium text-muted-foreground">
                    Select All
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
                />
              ))}
            </Accordion>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">No orders found matching your criteria.</p>
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
      <div className="hidden">
        <OrderInvoicesForPrint ref={printComponentRef} orders={ordersToPrint} />
      </div>
    </div>
  );
}
