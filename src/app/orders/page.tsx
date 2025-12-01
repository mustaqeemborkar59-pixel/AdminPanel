
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { type Order, type OrderStatus } from '@/types';
import { OrderListItem } from '@/components/orders/order-list-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getOrdersFromSheet, updateOrderStatusInSheet } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

const orderStatuses: OrderStatus[] = ['pending', 'queue', 'processing', 'dispatch', 'completed', 'hold', 'failed', 'cancelled'];
const ITEMS_PER_PAGE = 5;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTab, setCurrentTab] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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
  
  // Reset to page 1 whenever the tab or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab, searchTerm]);

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
    .filter(order => currentTab === 'all' || order.status === currentTab)
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
  
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Order Management"
        description="View and manage customer orders for your online shop from Google Sheets."
      />
      <div className="px-4 md:px-6 pt-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by Order ID or Customer Name..."
            className="pl-10 w-full md:max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as OrderStatus | 'all')}>
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-9">
            <TabsTrigger value="all" className="font-body">All</TabsTrigger>
            {orderStatuses.map(status => (
              <TabsTrigger key={status} value={status} className="font-body capitalize">{status}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : paginatedOrders.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {paginatedOrders.map((order, index) => (
              <OrderListItem key={`${order.id}-${startIndex + index}`} order={order} onUpdateStatus={handleUpdateOrderStatus} value={`${order.id}-${startIndex + index}`} />
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">No orders found.</p>
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
