"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { type Order, type OrderStatus } from '@/types';
import { OrderListItem } from '@/components/orders/order-list-item';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialOrders: Order[] = [
  { 
    id: 'ORD789', 
    customerName: 'Alice Johnson', 
    items: [
      { itemId: 'PROD001', name: 'Classic Leather Jacket', qty: 1, price: 250.00, imageUrl: 'https://placehold.co/100x100.png' },
      { itemId: 'PROD002', name: 'Slim Fit Jeans', qty: 1, price: 90.00, imageUrl: 'https://placehold.co/100x100.png' }
    ], 
    status: 'shipped', 
    orderType: 'delivery', 
    totalAmount: 340.00, 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    shippingAddress: '456 Oak Avenue, Somecity, USA',
    trackingId: '1Z999AA10123456789'
  },
  { 
    id: 'ORD456', 
    customerName: 'Bob Williams', 
    items: [{ itemId: 'PROD003', name: 'The Silent Observer (Book)', qty: 2, price: 22.50, imageUrl: 'https://placehold.co/100x100.png' }], 
    status: 'processing', 
    orderType: 'delivery', 
    totalAmount: 45.00, 
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    shippingAddress: '789 Pine Lane, Otherville, USA'
  },
  { 
    id: 'ORD123', 
    customerName: 'Charlie Brown', 
    items: [{ itemId: 'PROD004', name: 'Wireless Ergonomic Mouse', qty: 1, price: 75.00, imageUrl: 'https://placehold.co/100x100.png' }], 
    status: 'delivered', 
    orderType: 'delivery', 
    totalAmount: 75.00, 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    shippingAddress: '101 Maple Drive, Anytown, USA',
    trackingId: '1Z999AA10198765432'
  },
  { 
    id: 'ORD111', 
    customerName: 'Diana Prince', 
    items: [{ itemId: 'PROD005', name: 'Yoga Mat', qty: 1, price: 40.00, imageUrl: 'https://placehold.co/100x100.png' }], 
    status: 'placed', 
    orderType: 'delivery', 
    totalAmount: 40.00, 
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    shippingAddress: '222 Amazon Way, Themyscira'
  },
    { 
    id: 'ORD007', 
    customerName: 'James Bond', 
    items: [{ itemId: 'PROD007', name: 'Cufflinks', qty: 1, price: 150.00, imageUrl: 'https://placehold.co/100x100.png' }], 
    status: 'cancelled', 
    orderType: 'delivery', 
    totalAmount: 150.00, 
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    shippingAddress: 'MI6 Headquarters, London, UK'
  },
];


const orderStatuses: OrderStatus[] = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTab, setCurrentTab] = useState<OrderStatus | 'all'>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setOrders(initialOrders);
  }, []);

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const filteredOrders = currentTab === 'all'
    ? orders
    : orders.filter(order => order.status === currentTab);
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Order Management"
        description="View and manage customer orders for your online shop."
      />
      <div className="px-4 md:px-6 pt-4">
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as OrderStatus | 'all')}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            <TabsTrigger value="all" className="font-body">All</TabsTrigger>
            {orderStatuses.map(status => (
              <TabsTrigger key={status} value={status} className="font-body capitalize">{status}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-auto">
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <OrderListItem key={order.id} order={order} onUpdateStatus={handleUpdateOrderStatus} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">No orders found for this status.</p>
          </div>
        )}
      </div>
    </div>
  );
}
