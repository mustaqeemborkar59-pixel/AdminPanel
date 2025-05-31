
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2, MinusCircle, ShoppingCart } from "lucide-react";
import { type MenuItem, type Order, type OrderItem, type OrderType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateOrderDialogProps {
  menuItems: MenuItem[]; 
  onAddOrder: (orderData: Omit<Order, 'id' | 'timestamp' | 'totalAmount'>) => void;
}

const initialOrderItems: OrderItem[] = [];

export function CreateOrderDialog({ menuItems: availableMenuItems, onAddOrder }: CreateOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>(initialOrderItems);

  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>('');
  const [selectedItemQuantity, setSelectedItemQuantity] = useState<number>(1);

  useEffect(() => {
    // Reset form when dialog is opened/closed
    if (!isOpen) {
        setCustomerName('');
        setOrderType('dine-in');
        setTableNumber('');
        setCurrentOrderItems(initialOrderItems);
        setSelectedMenuItemId('');
        setSelectedItemQuantity(1);
    }
  }, [isOpen]);

  const handleAddSelectedItemToOrder = () => {
    if (!selectedMenuItemId || selectedItemQuantity <= 0) return;

    const menuItemToAdd = availableMenuItems.find(item => item.id === selectedMenuItemId);
    if (!menuItemToAdd) return;

    setCurrentOrderItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.itemId === menuItemToAdd.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].qty += selectedItemQuantity;
        return updatedItems;
      } else {
        return [...prevItems, { itemId: menuItemToAdd.id, name: menuItemToAdd.name, qty: selectedItemQuantity, price: menuItemToAdd.price }];
      }
    });
    setSelectedMenuItemId(''); // Reset selection
    setSelectedItemQuantity(1); // Reset quantity
  };

  const handleRemoveItemFromOrder = (itemId: string) => {
    setCurrentOrderItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
  };

  const handleQtyChangeInOrder = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItemFromOrder(itemId);
    } else {
      setCurrentOrderItems(prevItems => 
        prevItems.map(item => 
          item.itemId === itemId ? { ...item, qty: newQty } : item
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOrderItems.length === 0) {
      // Consider using a toast notification here instead of alert
      alert("Please add items to the order.");
      return;
    }
    onAddOrder({
      customerName,
      items: currentOrderItems,
      status: 'placed', // Default status
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
    });
    setIsOpen(false); // Close dialog
  };

  const totalAmount = currentOrderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-body">
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Order</DialogTitle>
          <DialogDescription className="font-body">
            Fill in customer and order details. Add items from the menu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
        <ScrollArea className="max-h-[70vh] pr-3">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerName" className="text-right font-body">Customer</Label>
              <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="col-span-3 font-body" placeholder="Customer Name (Optional)"/>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="orderType" className="text-right font-body">Order Type</Label>
              <Select value={orderType} onValueChange={(value) => setOrderType(value as OrderType)}>
                <SelectTrigger className="col-span-3 font-body">
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dine-in" className="font-body">Dine-In</SelectItem>
                  <SelectItem value="takeaway" className="font-body">Takeaway</SelectItem>
                  <SelectItem value="delivery" className="font-body">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderType === 'dine-in' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tableNumber" className="text-right font-body">Table No.</Label>
                <Input id="tableNumber" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="col-span-3 font-body" placeholder="Enter table number"/>
              </div>
            )}

            <div className="col-span-4 space-y-2 border-t pt-4 mt-2">
              <Label className="font-body font-semibold">Add Items to Order</Label>
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Label htmlFor="selectMenuItem" className="text-xs font-body">Menu Item</Label>
                  <Select value={selectedMenuItemId} onValueChange={setSelectedMenuItemId}>
                    <SelectTrigger id="selectMenuItem" className="font-body">
                      <SelectValue placeholder="Select an item" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMenuItems.filter(item => item.availability).map(item => (
                        <SelectItem key={item.id} value={item.id} className="font-body">
                          {item.name} (${item.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="itemQuantity" className="text-xs font-body">Qty</Label>
                  <Input 
                    id="itemQuantity" 
                    type="number" 
                    value={selectedItemQuantity} 
                    onChange={(e) => setSelectedItemQuantity(parseInt(e.target.value) || 1)} 
                    className="w-20 font-body text-center"
                    min="1"
                  />
                </div>
                <Button type="button" size="icon" onClick={handleAddSelectedItemToOrder} disabled={!selectedMenuItemId || selectedItemQuantity <= 0} aria-label="Add item to order">
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {currentOrderItems.length > 0 && (
              <div className="col-span-4 mt-4 space-y-2">
                <Label className="font-body font-semibold flex items-center"><ShoppingCart className="mr-2 h-4 w-4"/>Current Order</Label>
                <div className="border p-3 rounded-md bg-muted/30 space-y-2">
                  {currentOrderItems.map(item => (
                    <div key={item.itemId} className="flex items-center justify-between text-sm hover:bg-muted/50 p-1 rounded">
                      <div className="flex-grow">
                        <span className="font-body font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground ml-1">(${item.price.toFixed(2)} each)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => handleQtyChangeInOrder(item.itemId, parseInt(e.target.value))} 
                          className="w-16 h-8 text-center font-body"
                          min="0"
                        />
                        <span className="font-body w-20 text-right font-medium text-primary">${(item.price * item.qty).toFixed(2)}</span>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItemFromOrder(item.itemId)} className="h-8 w-8" aria-label={`Remove ${item.name} from order`}>
                          <MinusCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="col-span-4 mt-4 text-right">
              <p className="font-body text-lg font-semibold">Total: <span className="text-primary">${totalAmount.toFixed(2)}</span></p>
            </div>
          </div>
          </ScrollArea>
          <DialogFooter className="mt-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-body">Cancel</Button>
            <Button type="submit" className="font-body" disabled={currentOrderItems.length === 0}>Place Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
