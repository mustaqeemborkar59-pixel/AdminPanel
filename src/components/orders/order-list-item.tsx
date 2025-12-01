
import { type Order, type OrderStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Package, Truck, XCircle, PackageCheck, PackageSearch } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from 'next/image';

interface OrderListItemProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const statusInfo: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  placed: { icon: Clock, color: 'bg-blue-500', label: 'Placed' },
  processing: { icon: PackageSearch, color: 'bg-yellow-500', label: 'Processing' },
  shipped: { icon: PackageCheck, color: 'bg-indigo-500', label: 'Shipped' },
  delivered: { icon: Truck, color: 'bg-green-500', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-500', label: 'Cancelled' },
};


export function OrderListItem({ order, onUpdateStatus }: OrderListItemProps) {
  const currentStatusInfo = statusInfo[order.status] || statusInfo.placed;
  const StatusIcon = currentStatusInfo.icon;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg">{order.id}</CardTitle>
            <CardDescription className="font-body text-sm">
              {order.customerName || 'N/A'} - {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`capitalize font-body text-xs px-2 py-1 flex items-center ${currentStatusInfo.color.replace('bg-', 'border-').replace('-500', '-600')} ${currentStatusInfo.color.replace('bg-', 'text-').replace('-500', '-700')} bg-opacity-10`}>
            <StatusIcon className="h-3 w-3 mr-1.5" />
            {currentStatusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
            {order.items.map(item => (
                <div key={item.itemId} className="flex items-center gap-3 text-sm">
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
                    <p className="font-medium">${(item.qty * item.price).toFixed(2)}</p>
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
            <div className="flex justify-between text-base font-semibold text-foreground pt-2">
                <span>Total Amount:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/30 flex items-center justify-end gap-2">
        <Select value={order.status} onValueChange={(value) => onUpdateStatus(order.id, value as OrderStatus)}>
          <SelectTrigger className="w-[180px] font-body text-xs h-8">
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statusInfo).map(s => (
              <SelectItem key={s} value={s} className="font-body capitalize text-xs">{(statusInfo as any)[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}
