
"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type OrderItem, type OrderType, type MenuItem } from "@/types";
import { MinusCircle, PlusCircle, Trash2, Edit3, CreditCard, QrCode, ShoppingCart } from "lucide-react"; // Tentatively Banknote for cash
import { cn } from '@/lib/utils';

// Placeholder for Banknote if you add it, or use a different icon
const BanknoteIcon = ({className}: {className?: string}) => ( // Simple placeholder
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v12H3zM1 4h22v16H1z"/><path d="M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0"/></svg>
);


interface CurrentOrderSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  orderItems: OrderItem[];
  onUpdateItemQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: (details: { customerName: string; deliveryAddress?: string; orderType: OrderType; paymentMethod: 'cash' | 'card' | 'qr' }) => void;
  currentOrderType: OrderType;
  onOrderTypeChange: (orderType: OrderType) => void;
  currentPaymentMethod: 'cash' | 'card' | 'qr';
  onPaymentMethodChange: (method: 'cash' | 'card' | 'qr') => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  deliveryAddress: string;
  onDeliveryAddressChange: (address: string) => void;
  tableInfo?: { number?: string, customer?: string }; // For "Table 4 / Floyd Miles"
}

const TAX_RATE = 0.05; // 5%

export function CurrentOrderSheet({
  isOpen,
  onOpenChange,
  orderItems,
  onUpdateItemQuantity,
  onRemoveItem,
  onPlaceOrder,
  currentOrderType,
  onOrderTypeChange,
  currentPaymentMethod,
  onPaymentMethodChange,
  customerName,
  onCustomerNameChange,
  deliveryAddress,
  onDeliveryAddressChange,
  tableInfo = { number: '4', customer: 'Floyd Miles'} // Default example
}: CurrentOrderSheetProps) {

  const subTotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxAmount = subTotal * TAX_RATE;
  const totalAmount = subTotal + taxAmount;

  const handlePlaceOrderClick = () => {
    onPlaceOrder({
      customerName,
      deliveryAddress: currentOrderType === 'delivery' ? deliveryAddress : undefined,
      orderType: currentOrderType,
      paymentMethod: currentPaymentMethod,
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-lg font-semibold">
                {tableInfo?.number ? `Table ${tableInfo.number}` : 'Current Order'}
                {tableInfo?.customer && <span className="block text-xs font-normal text-muted-foreground">{tableInfo.customer}</span>}
            </SheetTitle>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Edit3 className="h-4 w-4" />
            </Button>
          </div>
          <Tabs value={currentOrderType} onValueChange={(value) => onOrderTypeChange(value as OrderType)} className="mt-2">
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="dine-in" className="text-xs px-1">Dine In</TabsTrigger>
              <TabsTrigger value="takeaway" className="text-xs px-1">Take Away</TabsTrigger>
              <TabsTrigger value="delivery" className="text-xs px-1">Delivery</TabsTrigger>
            </TabsList>
          </Tabs>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {orderItems.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Your order is empty.</p>
                <p className="text-xs">Add items from the menu.</p>
              </div>
            ) : (
              orderItems.map((item) => (
                <div key={item.itemId} className="flex items-center gap-3 p-2 rounded-md border hover:bg-muted/50">
                  <div className="relative h-14 w-14 rounded-md overflow-hidden shrink-0">
                    <Image
                      src={item.imageUrl || `https://placehold.co/100x100.png?text=Item`}
                      alt={item.name}
                      fill
                      className="object-cover"
                       data-ai-hint={item.name.toLowerCase().split(" ").slice(0,2).join(" ")}
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium leading-tight">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                     <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline" size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => onUpdateItemQuantity(item.itemId, item.qty - 1)}
                        disabled={item.qty <= 0} // disable if 0, effectively removing it
                      >
                        <MinusCircle className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                      <Button
                        variant="outline" size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => onUpdateItemQuantity(item.itemId, item.qty + 1)}
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${(item.price * item.qty).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="h-7 w-7 mt-1 text-destructive hover:text-destructive/80" onClick={() => onRemoveItem(item.itemId)}>
                        <Trash2 className="h-3.5 w-3.5"/>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {orderItems.length > 0 && (
            <>
            <div className="p-4 space-y-2 border-t">
                 {currentOrderType === 'delivery' && (
                    <div className="space-y-1">
                        <Label htmlFor="deliveryAddress" className="text-xs">Delivery Address</Label>
                        <Input id="deliveryAddress" placeholder="Enter delivery address" value={deliveryAddress} onChange={e => onDeliveryAddressChange(e.target.value)} className="h-9 text-sm"/>
                    </div>
                )}
                 <div className="space-y-1">
                    <Label htmlFor="customerName" className="text-xs">Customer Name (Optional)</Label>
                    <Input id="customerName" placeholder="Enter customer name" value={customerName} onChange={e => onCustomerNameChange(e.target.value)} className="h-9 text-sm"/>
                </div>
            </div>

            <div className="p-4 space-y-1 border-t">
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sub Total</span>
                <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span>${taxAmount.toFixed(2)}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-base font-semibold">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
                </div>
            </div>
            
            <div className="p-4 border-t">
                <Label className="block text-xs mb-1.5 text-muted-foreground">Payment Method</Label>
                <div className="grid grid-cols-3 gap-2">
                    {(['cash', 'card', 'qr'] as const).map((method) => {
                        const Icon = method === 'cash' ? BanknoteIcon : method === 'card' ? CreditCard : QrCode;
                        return (
                            <Button
                                key={method}
                                variant={currentPaymentMethod === method ? "default" : "outline"}
                                className={cn(
                                    "h-12 flex-col text-xs py-1",
                                    currentPaymentMethod === method ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                                )}
                                onClick={() => onPaymentMethodChange(method)}
                            >
                                <Icon className={cn("h-5 w-5 mb-0.5", currentPaymentMethod === method ? "" : "text-primary")}/>
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                            </Button>
                        );
                    })}
                </div>
            </div>
            </>
        )}

        <SheetFooter className="p-4 border-t">
          <Button 
            type="button" 
            className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
            onClick={handlePlaceOrderClick}
            disabled={orderItems.length === 0}
          >
            Place Order
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

