
"use client";
import { type Order, type OrderStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { CheckCircle, Clock, Package, Truck, XCircle, PackageSearch, ChevronDown, Archive } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OrderListItemProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  value: string; // For AccordionItem
}

const statusInfo: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: PackageSearch, color: 'bg-yellow-500', label: 'Pending' },
  failed: { icon: XCircle, color: 'bg-red-500', label: 'Failed' },
  cancelled: { icon: XCircle, color: 'bg-red-600', label: 'Cancelled' },
  queue: { icon: Clock, color: 'bg-blue-500', label: 'In Queue' },
  completed: { icon: CheckCircle, color: 'bg-green-500', label: 'Completed' },
  hold: { icon: Archive, color: 'bg-orange-500', label: 'On Hold' },
  dispatch: { icon: Truck, color: 'bg-indigo-500', label: 'Dispatched' },
};


export function OrderListItem({ order, onUpdateStatus, value }: OrderListItemProps) {
  const currentStatusInfo = statusInfo[order.status] || statusInfo.pending;
  const StatusIcon = currentStatusInfo.icon;

  return (
    <AccordionItem value={value} className="border-b-0">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                
                <div className="flex-grow">
                    <CardTitle className="font-headline text-lg">{order.id}</CardTitle>
                    <CardDescription className="font-body text-sm mt-1">
                    {order.customerName || 'N/A'} - <span className="text-xs">{formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}</span>
                    </CardDescription>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="flex-1">
                         <p className="text-xs text-muted-foreground font-body">Total</p>
                         <p className="font-semibold text-lg text-foreground">₹{order.totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-body mb-1">Status</p>
                         <Select value={order.status} onValueChange={(value) => onUpdateStatus(order.id, value as OrderStatus)}>
                            <SelectTrigger className={cn(
                                "w-full sm:w-[140px] font-body text-xs h-9 capitalize",
                                `border-0 bg-opacity-10 dark:bg-opacity-20`,
                                `${currentStatusInfo.color.replace('bg-','bg-/')} ${currentStatusInfo.color.replace('bg-','text-').replace('-500','-700 dark:text-white').replace('-600','-800 dark:text-white')}`
                            )}>
                                <div className="flex items-center gap-1.5">
                                    <StatusIcon className="h-3 w-3" />
                                    <SelectValue placeholder="Update status" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(statusInfo).map(s => (
                                <SelectItem key={s} value={s} className="font-body capitalize text-xs">{(statusInfo as any)[s].label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
                     <AccordionTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-full p-2")}>
                        <span className="ml-2">Details</span>
                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    </AccordionTrigger>
                </div>

                </div>
            </CardHeader>
             <AccordionContent>
                <CardContent className="p-4 pt-0 space-y-4">
                    <div className="space-y-2">
                        {order.items.map(item => (
                            <div key={item.itemId} className="flex items-center gap-3 text-sm p-2 rounded-md bg-muted/50">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden shrink-0">
                                    <Image
                                        src={item.imageUrl || `https://placehold.co/100x100.png?text=Item`}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="product image"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                                </div>
                                <p className="font-medium">₹{(item.qty * item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-3 space-y-2 text-sm text-muted-foreground">
                        {order.shippingAddress && (
                            <div className="flex justify-between">
                                <span>Shipping To:</span>
                                <span className="text-right font-medium text-foreground">{order.shippingAddress}</span>
                            </div>
                        )}
                        {order.trackingId && (
                            <div className="flex justify-between">
                                <span>Tracking ID:</span>
                                <span className="text-right font-medium text-primary">{order.trackingId}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </AccordionContent>
        </Card>
    </AccordionItem>
  );
}
