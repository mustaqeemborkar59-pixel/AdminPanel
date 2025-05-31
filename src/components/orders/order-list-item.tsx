
import { type Order, type OrderStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, CookingPot, Truck, XCircle, ShoppingBag, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderListItemProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const statusInfo: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  placed: { icon: Clock, color: 'bg-blue-500', label: 'Placed' },
  preparing: { icon: CookingPot, color: 'bg-yellow-500', label: 'Preparing' },
  ready: { icon: CheckCircle, color: 'bg-green-500', label: 'Ready' },
  delivered: { icon: Truck, color: 'bg-purple-500', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-500', label: 'Cancelled' },
};

const orderTypeIcons: Record<Order['orderType'], React.ElementType> = {
  'dine-in': CookingPot,
  'takeaway': ShoppingBag,
  'delivery': Truck,
};

export function OrderListItem({ order, onUpdateStatus }: OrderListItemProps) {
  const StatusIcon = statusInfo[order.status].icon;
  const OrderTypeIcon = orderTypeIcons[order.orderType];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline text-lg">{order.id}</CardTitle>
            <CardDescription className="font-body text-sm">
              {order.customerName || 'Walk-in Customer'} - {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
            </CardDescription>
          </div>
          <Badge variant="outline" className={`capitalize font-body text-xs px-2 py-1 flex items-center ${statusInfo[order.status].color.replace('bg-', 'border-').replace('-500', '-600')} ${statusInfo[order.status].color.replace('bg-', 'text-').replace('-500', '-700')} bg-opacity-10`}>
            <StatusIcon className="h-3 w-3 mr-1.5" />
            {statusInfo[order.status].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ul className="space-y-1 text-sm font-body text-muted-foreground mb-3">
          {order.items.map(item => (
            <li key={item.itemId} className="flex justify-between">
              <span>{item.name} x {item.qty}</span>
              <span>${(item.qty * item.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center text-sm font-body">
            <div className="flex items-center text-muted-foreground">
                 <OrderTypeIcon className="h-4 w-4 mr-1.5" />
                 <span className="capitalize">{order.orderType}</span>
                 {order.orderType === 'dine-in' && order.tableNumber && <span className="ml-1">(Table {order.tableNumber})</span>}
            </div>
            <p className="font-semibold text-lg text-primary">${order.totalAmount.toFixed(2)}</p>
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
        {/* <Button variant="outline" size="sm" className="font-body text-xs h-8">
            <Edit className="h-3 w-3 mr-1.5"/> View/Edit
        </Button> */}
      </CardFooter>
    </Card>
  );
}
