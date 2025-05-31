
"use client";
import { useState, type ReactNode, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, LayoutGrid, Egg, Soup, Wheat, CookingPot, Sandwich, Utensils, ShoppingCart } from 'lucide-react';
import { type MenuItem, type OrderItem, type Order } from '@/types';
import { Input } from '@/components/ui/input';
import { AddMenuItemDialog } from '@/components/menu/add-menu-item-dialog';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { CurrentOrderSheet } from '@/components/menu/current-order-sheet';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const initialMenuItems: MenuItem[] = [
  { id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, availability: true, description: 'Classic cheese and tomato pizza.', imageUrl: 'https://i.pinimg.com/736x/47/6d/6f/476d6f63f0a080a004cc579f9dfd1f4f.jpg', imageHint: 'pizza cheese' },
  { id: '2', name: 'Spaghetti Carbonara', category: 'Pasta', price: 15.50, availability: true, description: 'Creamy pasta with bacon and egg.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'pasta carbonara' },
  { id: '3', name: 'Caesar Salad', category: 'Salads', price: 9.75, availability: false, description: 'Fresh salad with Caesar dressing.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'salad greens' },
  { id: '4', name: 'Tiramisu', category: 'Desserts', price: 7.00, availability: true, description: 'Classic Italian coffee dessert.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'dessert cake' },
  { id: '5', name: 'Bruschetta', category: 'Starters', price: 8.50, availability: true, description: 'Toasted bread with tomatoes and basil.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'bread appetizer' },
  { id: '6', name: 'Gourmet Burger', category: 'Burgers', price: 18.75, availability: true, description: 'Premium beef burger with special sauce.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'burger beef' },
  { id: '7', name: 'Chicken Soup', category: 'Soups', price: 8.00, availability: true, description: 'Hearty chicken noodle soup.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'soup chicken' },
  { id: '8', name: 'Steak Frites', category: 'Main Course', price: 25.00, availability: true, description: 'Grilled steak with french fries.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'steak fries' },
  { id: '9', name: 'Pancakes', category: 'Breakfast', price: 10.50, availability: false, description: 'Fluffy pancakes with syrup.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'pancakes breakfast' },
];

const categoryIcons: Record<string, React.ElementType> = {
  all: LayoutGrid,
  pizza: Utensils,
  pasta: Wheat,
  salads: LayoutGrid,
  desserts: Egg,
  starters: Utensils,
  burgers: Sandwich,
  soups: Soup,
  'main course': CookingPot,
  breakfast: Egg,
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);

  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [isOrderSheetOpen, setIsOrderSheetOpen] = useState(false);
  const [orderCustomerName, setOrderCustomerName] = useState('');
  const [orderDeliveryAddress, setOrderDeliveryAddress] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    setMenuItems(initialMenuItems);
  }, []);

  const handleAddMenuItem = (newItemData: Omit<MenuItem, 'id'>) => {
    if (editingItem) {
      setMenuItems(prevItems => prevItems.map(item => item.id === editingItem.id ? { ...item, ...newItemData } : item));
      setEditingItem(undefined);
    } else {
      setMenuItems(prevItems => [...prevItems, { ...newItemData, id: String(Date.now()) }]);
    }
    setIsAddMenuItemDialogOpen(false);
  };

  const openEditMenuItemDialog = (itemToEdit: MenuItem) => {
    setEditingItem(itemToEdit);
    setIsAddMenuItemDialogOpen(true);
  };
  
  const openAddMenuItemDialog = () => {
    setEditingItem(undefined);
    setIsAddMenuItemDialogOpen(true);
  }

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleToggleAvailability = (itemId: string, availability: boolean) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, availability } : item
      )
    );
  };

  // --- Order Management Functions ---
  const handleAddItemToOrder = (menuItem: MenuItem) => {
    if (!menuItem.availability) {
      toast({
        title: "Item Unavailable",
        description: `${menuItem.name} is currently unavailable.`,
        variant: "destructive",
      });
      return;
    }
    setCurrentOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.itemId === menuItem.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.itemId === menuItem.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, { itemId: menuItem.id, name: menuItem.name, price: menuItem.price, qty: 1 }];
    });
    toast({
      title: "Item Added",
      description: `${menuItem.name} added to current order.`,
    });
    setIsOrderSheetOpen(true); // Open sheet when item is added
  };

  const handleUpdateOrderItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveOrderItem(itemId);
    } else {
      setCurrentOrderItems(prevItems =>
        prevItems.map(item => (item.itemId === itemId ? { ...item, qty: newQuantity } : item))
      );
    }
  };

  const handleRemoveOrderItem = (itemId: string) => {
    setCurrentOrderItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
  };

  const handlePlaceOrder = () => {
    if (currentOrderItems.length === 0) {
      toast({ title: "Empty Order", description: "Please add items to the order.", variant: "destructive"});
      return;
    }
    const totalAmount = currentOrderItems.reduce((sum, item) => sum + item.qty * item.price, 0);
    const newOrder: Omit<Order, 'id' | 'timestamp'> = {
      customerName: orderCustomerName,
      orderType: orderDeliveryAddress ? 'delivery' : 'takeaway', 
      items: currentOrderItems,
      status: 'placed',
      totalAmount,
    };

    console.log("Placing Order:", newOrder); 
    toast({
      title: "Order Placed (Simulated)",
      description: `Order for ${orderCustomerName || 'customer'} totaling $${totalAmount.toFixed(2)} has been logged.`,
    });

    setCurrentOrderItems([]);
    setOrderCustomerName('');
    setOrderDeliveryAddress('');
    setIsOrderSheetOpen(false);
  };


  const uniqueCategories = ['all', ...new Set(menuItems.map(item => item.category.toLowerCase()))];
  
  const categoryCounts = menuItems.reduce((acc, item) => {
    const categoryKey = item.category.toLowerCase();
    acc[categoryKey] = (acc[categoryKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoriesWithCounts = uniqueCategories.map(catName => {
    const count = catName === 'all' ? menuItems.length : categoryCounts[catName] || 0;
    const Icon = categoryIcons[catName.toLowerCase()] || Utensils;
    return { name: catName, count, Icon };
  });

  const filteredItems = menuItems.filter(item =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase())
  );
  
  const currentOrderTotalItems = currentOrderItems.reduce((sum, item) => sum + item.qty, 0);


  if (!isMounted) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p className="text-muted-foreground font-body">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <PageHeader
        title="Menu & Ordering"
        description="Manage menu items and create customer orders."
        actions={
          <div className="flex items-center gap-2">
            <AddMenuItemDialog 
              onAddItem={handleAddMenuItem} 
              existingItem={editingItem} 
              isOpen={isAddMenuItemDialogOpen} 
              setIsOpen={setIsAddMenuItemDialogOpen}
              triggerButton={
                <Button onClick={openAddMenuItemDialog} variant="outline" className="font-body">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
                </Button>
              }
            />
            <Button onClick={() => setIsOrderSheetOpen(true)} className="font-body bg-primary hover:bg-primary/90 text-primary-foreground relative">
              <ShoppingCart className="mr-2 h-4 w-4" /> View Current Order
              {currentOrderTotalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {currentOrderTotalItems}
                </span>
              )}
            </Button>
          </div>
        }
      />
      <div className="p-4 md:p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products here..."
            className="pl-10 w-full bg-card border-border focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-3 pb-3">
            {categoriesWithCounts.map(({ name, count, Icon }) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => setSelectedCategory(name)}
                className={cn(
                  "flex flex-col items-start justify-center h-auto p-3 rounded-lg shadow-sm border border-border transition-all",
                  "w-32 text-left", 
                  selectedCategory.toLowerCase() === name.toLowerCase()
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                    : 'bg-card text-card-foreground hover:bg-secondary'
                )}
              >
                <Icon className={cn("h-6 w-6 mb-1", selectedCategory.toLowerCase() === name.toLowerCase() ? 'text-primary-foreground' : 'text-primary')} />
                <span className="font-semibold text-sm capitalize font-body">{name}</span>
                <span className="text-xs font-body opacity-70">{count} Items</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {filteredItems.length > 0 ? (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEditAdminAction={() => openEditMenuItemDialog(item)}
                onDeleteAdminAction={() => handleDeleteMenuItem(item.id)}
                onToggleAvailabilityAdminAction={handleToggleAvailability}
                onAddToOrder={handleAddItemToOrder}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">No menu items match your search or filter criteria.</p>
          </div>
        )}
      </div>
      <CurrentOrderSheet
        isOpen={isOrderSheetOpen}
        setIsOpen={setIsOrderSheetOpen}
        orderItems={currentOrderItems}
        customerName={orderCustomerName}
        setCustomerName={setOrderCustomerName}
        deliveryAddress={orderDeliveryAddress}
        setDeliveryAddress={setOrderDeliveryAddress}
        onUpdateQuantity={handleUpdateOrderItemQuantity}
        onRemoveItem={handleRemoveOrderItem}
        onPlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}


    