
"use client";
import { useState, type ReactNode, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search, LayoutGrid, Egg, Soup, Wheat, CookingPot, Sandwich, Utensils } from 'lucide-react';
import { type MenuItem } from '@/types';
import { Input } from '@/components/ui/input';
import { AddMenuItemDialog } from '@/components/menu/add-menu-item-dialog';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';

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
  pizza: Utensils, // Placeholder, could be more specific
  pasta: Wheat,
  salads: LayoutGrid, // Placeholder
  desserts: Egg, // Placeholder for cake/sweet
  starters: Utensils, // Placeholder
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setMenuItems(initialMenuItems);
  }, []);

  const handleAddItem = (newItemData: Omit<MenuItem, 'id'>) => {
    if (editingItem) {
      setMenuItems(prevItems => prevItems.map(item => item.id === editingItem.id ? { ...item, ...newItemData } : item));
      setEditingItem(undefined);
    } else {
      setMenuItems(prevItems => [...prevItems, { ...newItemData, id: String(Date.now()) }]);
    }
    setIsAddDialogOpen(false);
  };

  const openEditDialog = (itemToEdit: MenuItem) => {
    setEditingItem(itemToEdit);
    setIsAddDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setEditingItem(undefined);
    setIsAddDialogOpen(true);
  }

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleToggleAvailability = (itemId: string, availability: boolean) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, availability } : item
      )
    );
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
        title="Menu"
        description="Manage your restaurant's offerings."
        actions={
          <AddMenuItemDialog 
            onAddItem={handleAddItem} 
            existingItem={editingItem} 
            isOpen={isAddDialogOpen} 
            setIsOpen={setIsAddDialogOpen}
            triggerButton={
              <Button onClick={openAddDialog} className="font-body bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
              </Button>
            }
          />
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
                  "w-32 h-24 text-left", 
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
          <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => openEditDialog(item)}
                onDelete={() => handleDeleteItem(item.id)}
                onToggleAvailability={handleToggleAvailability}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">No menu items match your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
