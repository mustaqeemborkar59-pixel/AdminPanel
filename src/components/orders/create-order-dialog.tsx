
"use client";

import { useState } from 'react';
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
import { PlusCircle, Trash2 } from "lucide-react";
import { type MenuItem, type Order, type OrderItem, type OrderType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateOrderDialogProps {
  menuItems: MenuItem[]; // For item selection - ideally fetched or passed
  onAddOrder: (orderData: Omit<Order, 'id' | 'timestamp' | 'totalAmount'>) => void;
}

const initialOrderItems: OrderItem[] = [];

export function CreateOrderDialog({ menuItems: availableMenuItems, onAddOrder }: CreateOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems] = useState<OrderItem[]>(initialOrderItems);

  // Simulating available menu items for the dropdown
  const simulatedMenuItems: MenuItem[] = [
    { id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, availability: true },
    { id: '2', name: 'Spaghetti Carbonara', category: 'Pasta', price: 15.50, availability: true },
    { id: '3', name: 'Caesar Salad', category: 'Salads', price: 9.75, availability: true },
  ];

  const handleAddItem = () => {
    // Placeholder for adding an item. In a real app, this would involve selecting from menuItems.
    if (simulatedMenuItems.length > 0) {
      const randomItem = simulatedMenuItems[Math.floor(Math.random() * simulatedMenuItems.length)];
      const existingItem = items.find(i => i.itemId === randomItem.id);
      if (existingItem) {
        setItems(items.map(i => i.itemId === randomItem.id ? { ...i, qty: i.qty + 1 } : i));
      } else {
        setItems([...items, { itemId: randomItem.id, name: randomItem.name, qty: 1, price: randomItem.price }]);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.itemId !== itemId));
  };

  const handleQtyChange = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
    } else {
      setItems(items.map(item => item.itemId === itemId ? { ...item, qty: newQty } : item));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add items to the order.");
      return;
    }
    onAddOrder({
      customerName,
      items,
      status: 'placed',
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
    });
    setIsOpen(false);
    // Reset form
    setCustomerName('');
    setOrderType('dine-in');
    setTableNumber('');
    setItems(initialOrderItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.qty * item.price, 0);

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
            Fill in customer and order details. Click 'Place Order' when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right font-body">Customer</Label>
            <Input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="col-span-3 font-body" placeholder="Optional"/>
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
              <Input id="tableNumber" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="col-span-3 font-body" />
            </div>
          )}

          <div className="col-span-4">
            <Label className="font-body">Order Items</Label>
            <div className="mt-2 space-y-2 border p-3 rounded-md bg-muted/30">
              {items.map(item => (
                <div key={item.itemId} className="flex items-center justify-between text-sm">
                  <span className="font-body">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={item.qty} 
                      onChange={(e) => handleQtyChange(item.itemId, parseInt(e.target.value))} 
                      className="w-16 h-8 text-center font-body"
                      min="0"
                    />
                    <span className="font-body w-16 text-right">${(item.price * item.qty).toFixed(2)}</span>
                    <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(item.itemId)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="text-xs text-muted-foreground font-body text-center py-2">No items added yet.</p>}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="mt-2 font-body w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item (Random)
            </Button>
          </div>
          
          <div className="col-span-4 mt-4 text-right">
            <p className="font-body text-lg font-semibold">Total: <span className="text-primary">${totalAmount.toFixed(2)}</span></p>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="font-body">Cancel</Button>
            <Button type="submit" className="font-body">Place Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
