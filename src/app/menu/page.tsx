
"use client";
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  LayoutGrid, Soup, SaladIcon, Grape, Fish, Sandwich, Coffee, Cake, Search, PlusCircle, Settings, ListFilter, Eye, EyeOff, Edit3
} from 'lucide-react'; // Assuming some icons
import type { MenuItem, OrderItem, OrderType } from '@/types';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { AddMenuItemDialog } from '@/components/menu/add-menu-item-dialog';
import { CurrentOrderSheet } from '@/components/menu/current-order-sheet';
import { initialMenuItems as allMenuItems, categories as categoryData } from '@/lib/menu-item-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const iconMap: { [key: string]: React.ElementType } = {
  LayoutGrid, Soup, SaladIcon, Grape, Fish, Sandwich, Coffee, Cake, Settings
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(allMenuItems);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false); // Toggle for admin controls

  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false);
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState('');
  const [currentOrderType, setCurrentOrderType] = useState<OrderType>('dine-in');
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<'cash' | 'card' | 'qr'>('card');
  
  const [itemToEdit, setItemToEdit] = useState<MenuItem | undefined>(undefined);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let items = menuItems;
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(items);
  }, [selectedCategory, searchTerm, menuItems]);

  const handleSaveMenuItem = (itemData: Omit<MenuItem, 'id'> | MenuItem) => {
    if ('id' in itemData) { // Editing existing item
      setMenuItems(prevItems => prevItems.map(item => item.id === itemData.id ? itemData : item));
      toast({ title: "Item Updated", description: `${itemData.name} has been updated.` });
    } else { // Adding new item
      const newItem: MenuItem = {
        ...itemData,
        id: `MENU${Date.now()}${Math.random().toString(36).substring(2, 5)}`,
        imageHint: itemData.name.toLowerCase().split(" ").slice(0,2).join(" "), // basic hint
      };
      setMenuItems(prevItems => [newItem, ...prevItems]);
      toast({ title: "Item Added", description: `${newItem.name} has been added to the menu.` });
    }
    setIsAddEditDialogOpen(false);
    setItemToEdit(undefined);
  };

  const handleOpenEditDialog = (item: MenuItem) => {
    setItemToEdit(item);
    setIsAddEditDialogOpen(true);
  };
  
  const handleOpenAddDialog = () => {
    setItemToEdit(undefined);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({ title: "Item Deleted", description: `Item has been removed from the menu.`, variant: "destructive" });
  };

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, availability: !item.availability } : item
      )
    );
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        toast({ title: "Availability Updated", description: `${item.name} is now ${!item.availability ? 'available' : 'unavailable'}.`});
    }
  };

  const handleAddToOrder = (item: MenuItem) => {
    setCurrentOrderItems(prevOrderItems => {
      const existingItem = prevOrderItems.find(oi => oi.itemId === item.id);
      if (existingItem) {
        return prevOrderItems.map(oi =>
          oi.itemId === item.id ? { ...oi, qty: oi.qty + 1 } : oi
        );
      } else {
        const displayPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
        return [...prevOrderItems, { itemId: item.id, name: item.name, qty: 1, price: displayPrice, imageUrl: item.imageUrl }];
      }
    });
    if(!isOrderSheetOpen) setIsOrderSheetOpen(true); // Open sheet if not already open
    toast({ title: "Item Added", description: `${item.name} added to order.` });
  };

  const handleUpdateOrderItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCurrentOrderItems(prev => prev.filter(item => item.itemId !== itemId));
    } else {
      setCurrentOrderItems(prev =>
        prev.map(item => (item.itemId === itemId ? { ...item, qty: newQuantity } : item))
      );
    }
  };

  const handleRemoveOrderItem = (itemId: string) => {
    setCurrentOrderItems(prev => prev.filter(item => item.itemId !== itemId));
  };

  const handlePlaceOrder = (details: { customerName: string; deliveryAddress?: string; orderType: OrderType; paymentMethod: 'cash' | 'card' | 'qr' }) => {
    // In a real app, this would send data to a backend
    const subTotal = currentOrderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const taxAmount = subTotal * 0.05; // Assuming 5% tax
    const totalAmount = subTotal + taxAmount;

    const newOrder = {
        id: `ORD${Date.now()}`,
        customerName: details.customerName,
        items: currentOrderItems,
        status: 'placed' as const,
        orderType: details.orderType,
        deliveryAddress: details.deliveryAddress,
        paymentMethod: details.paymentMethod,
        subTotal,
        taxAmount,
        totalAmount,
        timestamp: new Date().toISOString(),
    };
    console.log('Placing Order:', newOrder);
    toast({ title: "Order Placed!", description: `Order ${newOrder.id} has been successfully placed.` });
    setCurrentOrderItems([]);
    setOrderCustomerName('');
    setOrderDeliveryAddress('');
    setIsOrderSheetOpen(false);
  };

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { All: menuItems.length };
    categoryData.forEach(cat => {
      if (cat.name !== 'All') {
        counts[cat.name] = menuItems.filter(item => item.category === cat.name).length;
      }
    });
    return counts;
  }, [menuItems]);
  
  if (!isMounted) {
    return <div className="flex items-center justify-center h-screen"><PlusCircle className="h-10 w-10 animate-spin text-primary" /></div>; // Or a loading spinner
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Menu"
        description="Browse items and manage your restaurant's menu."
        actions={
          <div className="flex items-center gap-2">
            <Button variant={isAdminMode ? "default" : "outline"} size="sm" onClick={() => setIsAdminMode(!isAdminMode)}>
              <Settings className="mr-2 h-4 w-4" /> {isAdminMode ? "Exit Admin" : "Admin Mode"}
            </Button>
            {isAdminMode && (
                <Button size="sm" onClick={handleOpenAddDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Item
                </Button>
            )}
          </div>
        }
      />
      
      {isAddEditDialogOpen && (
        <AddMenuItemDialog
            isOpen={isAddEditDialogOpen} // Control externally
            onOpenChange={setIsAddEditDialogOpen} // Control externally
            onSaveItem={handleSaveMenuItem}
            existingItem={itemToEdit}
            trigger={<></>} // No default trigger, managed by state
        />
       )}


      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto] overflow-hidden">
        {/* Left Panel: Menu Items */}
        <div className="flex flex-col overflow-hidden p-4 md:p-6">
            <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 h-10 w-full text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                    <ListFilter className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="mb-4 -mx-4 sm:mx-0">
                <div className="flex gap-2 px-4 sm:px-0 pb-3">
                {categoryData.map(cat => {
                    const Icon = iconMap[cat.icon] || LayoutGrid;
                    const count = categoryCounts[cat.name] || 0;
                    const isActive = selectedCategory === cat.name;
                    return (
                    <Button
                        key={cat.name}
                        variant={isActive ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={cn(
                            "flex flex-col items-start h-auto p-3 rounded-lg shadow-sm min-w-[100px] text-left",
                            isActive ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted/80"
                        )}
                    >
                        <Icon className={cn("h-5 w-5 mb-1", isActive ? "text-primary-foreground" : "text-primary")} />
                        <span className={cn("text-xs font-medium", isActive ? "text-primary-foreground" : "text-card-foreground")}>{cat.name}</span>
                        <span className={cn("text-[10px]", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>{count} Items</span>
                    </Button>
                    );
                })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <ScrollArea className="flex-1 -mx-4 sm:mx-0">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 px-4 sm:px-0 pb-6">
                {filteredItems.map(item => (
                    <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToOrder={handleAddToOrder}
                    isAdminView={isAdminMode}
                    onEditAdminAction={handleOpenEditDialog}
                    onDeleteAdminAction={handleDeleteMenuItem}
                    onToggleAvailabilityAdminAction={handleToggleAvailability}
                    />
                ))}
                {filteredItems.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground py-10">
                    No menu items match your criteria.
                    </p>
                )}
                </div>
            </ScrollArea>
        </div>

        {/* Right Panel: Order Sheet - shown via Sheet component */}
      </div>
      <CurrentOrderSheet
        isOpen={isOrderSheetOpen}
        onOpenChange={setIsOrderSheetOpen}
        orderItems={currentOrderItems}
        onUpdateItemQuantity={handleUpdateOrderItemQuantity}
        onRemoveItem={handleRemoveOrderItem}
        onPlaceOrder={handlePlaceOrder}
        currentOrderType={currentOrderType}
        onOrderTypeChange={setCurrentOrderType}
        currentPaymentMethod={currentPaymentMethod}
        onPaymentMethodChange={setCurrentPaymentMethod}
        customerName={orderCustomerName}
        onCustomerNameChange={setOrderCustomerName}
        deliveryAddress={orderDeliveryAddress}
        onDeliveryAddressChange={setOrderDeliveryAddress}
        // You can pass tableInfo here if needed
      />
    </div>
  );
}
