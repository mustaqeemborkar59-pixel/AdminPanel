
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { type OrderItem } from "@/types";
import { MinusCircle, PlusCircle, ShoppingCart, Trash2, DollarSign } from "lucide-react";

interface CurrentOrderSheetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  orderItems: OrderItem[];
  customerName: string;
  setCustomerName: (name: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onPlaceOrder: () => void;
}

export function CurrentOrderSheet({
  isOpen,
  setIsOpen,
  orderItems,
  customerName,
  setCustomerName,
  deliveryAddress,
  setDeliveryAddress,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
}: CurrentOrderSheetProps) {
  const totalAmount = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const totalItemsCount = orderItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col bg-card">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="font-headline text-2xl flex items-center">
            <ShoppingCart className="mr-3 h-6 w-6 text-primary" /> Current Order
          </SheetTitle>
          <SheetDescription className="font-body">
            Review items, add customer details, and place the order.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-grow px-6 py-4">
          {orderItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
              <p className="font-body text-lg">Your order is empty.</p>
              <p className="font-body text-sm">Add items from the menu to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.itemId} className="flex items-center gap-4 p-3 border rounded-lg shadow-sm bg-background hover:bg-muted/50">
                  <div className="flex-grow">
                    <p className="font-semibold font-body">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.itemId, item.qty - 1)}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="font-body w-6 text-center">{item.qty}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onUpdateQuantity(item.itemId, item.qty + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-semibold font-body w-20 text-right text-primary">
                    ${(item.qty * item.price).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                    onClick={() => onRemoveItem(item.itemId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {orderItems.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="px-6 space-y-4">
              <div>
                <Label htmlFor="customerName" className="font-body">Customer Name (Optional)</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 font-body"
                  placeholder="Enter customer's name"
                />
              </div>
              <div>
                <Label htmlFor="deliveryAddress" className="font-body">Delivery Address (Optional)</Label>
                <Textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="mt-1 font-body"
                  placeholder="Enter delivery address if applicable"
                  rows={2}
                />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="px-6 py-4 flex justify-between items-center text-lg font-headline">
              <span>Total ({totalItemsCount} items):</span>
              <span className="text-primary font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </>
        )}

        <SheetFooter className="px-6 pb-6 pt-4 mt-auto bg-muted/30 border-t">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-body w-full sm:w-auto">
            Close
          </Button>
          {orderItems.length > 0 && (
            <Button onClick={onPlaceOrder} className="font-body w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              Place Order (${totalAmount.toFixed(2)})
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
