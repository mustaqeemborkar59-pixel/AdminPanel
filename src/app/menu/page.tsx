
"use client";
import { useState, type ReactNode, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search, Filter } from 'lucide-react';
import { type MenuItem } from '@/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddMenuItemDialog } from '@/components/menu/add-menu-item-dialog';
import { MenuItemCard } from '@/components/menu/menu-item-card';

const initialMenuItems: MenuItem[] = [
  { id: '1', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, availability: true, description: 'Classic cheese and tomato pizza.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'pizza cheese' },
  { id: '2', name: 'Spaghetti Carbonara', category: 'Pasta', price: 15.50, availability: true, description: 'Creamy pasta with bacon and egg.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'pasta carbonara' },
  { id: '3', name: 'Caesar Salad', category: 'Salads', price: 9.75, availability: false, description: 'Fresh salad with Caesar dressing.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'salad greens' },
  { id: '4', name: 'Tiramisu', category: 'Desserts', price: 7.00, availability: true, description: 'Classic Italian coffee dessert.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'dessert cake' },
  { id: '5', name: 'Bruschetta', category: 'Starters', price: 8.50, availability: true, description: 'Toasted bread with tomatoes and basil.', imageUrl: 'https://placehold.co/300x200.png', imageHint: 'bread appetizer' },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setMenuItems(initialMenuItems);
  }, []);


  const handleAddItem = (newItem: Omit<MenuItem, 'id'>) => {
    setMenuItems(prevItems => [...prevItems, { ...newItem, id: String(Date.now()) }]);
  };

  const handleEditItem = (updatedItem: MenuItem) => {
    setMenuItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  const filteredItems = menuItems.filter(item =>
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === 'all' || item.category === selectedCategory)
  );

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Menu Management"
        description="Add, edit, or delete food items and manage categories."
        actions={<AddMenuItemDialog onAddItem={handleAddItem} />}
      />
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu items..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="font-body">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {filteredItems.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => {
                  const itemToEdit = menuItems.find(i => i.id === item.id);
                  if (itemToEdit) {
                    // For simplicity, using AddMenuItemDialog also for editing by passing existing item
                    // In a real app, you might have a dedicated EditMenuItemDialog or prefill AddMenuItemDialog
                    // This example would need AddMenuItemDialog to accept an `itemToEdit` prop
                    console.log("Edit item:", itemToEdit);
                  }
                }}
                onDelete={() => handleDeleteItem(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-body">No menu items match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
