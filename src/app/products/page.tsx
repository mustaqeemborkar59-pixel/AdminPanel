
"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  LayoutGrid, Book, Search, PlusCircle
} from 'lucide-react';
import type { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { AddMenuItemDialog } from '@/components/menu/add-menu-item-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getProductsFromWooCommerce } from './actions';
import { Loader2 } from 'lucide-react';

const iconMap: { [key: string]: React.ElementType } = {
  All: LayoutGrid,
  Default: Book,
};


export default function ProductsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [categories, setCategories] = useState<{name: string; icon: string}[]>([]);
  
  const [itemToEdit, setItemToEdit] = useState<MenuItem | undefined>(undefined);
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const categoriesContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const fetchProducts = async () => {
      setIsLoading(true);
      const result = await getProductsFromWooCommerce();
      if (result.success && result.data) {
        setMenuItems(result.data);
        // Dynamically create categories from fetched products
        const productCategories = Array.from(new Set(result.data.map(p => p.category)));
        const newCategories = [
          { name: 'All', icon: 'All' },
          ...productCategories.map(c => ({ name: c, icon: 'Default' }))
        ];
        setCategories(newCategories);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load products",
          description: result.error || "Could not fetch products from WooCommerce.",
        });
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [toast]);

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
    // This is now a client-side only operation and will not persist.
    // A server action would be needed to update WooCommerce.
    if ('id' in itemData) { 
      setMenuItems(prevItems => prevItems.map(item => item.id === itemData.id ? itemData as MenuItem : item));
      toast({ title: "Product Updated (Client-side)", description: `${itemData.name} has been updated locally. This will not affect your WooCommerce store.` });
    } else { 
      const newItem: MenuItem = {
        ...itemData,
        id: `PROD${Date.now()}${Math.random().toString(36).substring(2, 5)}`,
        imageHint: itemData.name.toLowerCase().split(" ").slice(0,2).join(" "),
      };
      setMenuItems(prevItems => [newItem, ...prevItems]);
      toast({ title: "Product Added (Client-side)", description: `${newItem.name} has been added locally. This will not affect your WooCommerce store.` });
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
    toast({ title: "Product Deleted (Client-side)", description: `Product has been removed locally. This will not affect your WooCommerce store.`, variant: "destructive" });
  };

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, availability: !item.availability } : item
      )
    );
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        toast({ title: "Availability Updated (Client-side)", description: `${item.name} is now ${!item.availability ? 'available' : 'unavailable'}. This will not affect your WooCommerce store.`});
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { All: menuItems.length };
    categories.forEach(cat => {
      if (cat.name !== 'All') {
        counts[cat.name] = menuItems.filter(item => item.category === cat.name).length;
      }
    });
    return counts;
  }, [menuItems, categories]);

  if (!isMounted) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Product Management"
        description="View, add, and manage all your store's products."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleOpenAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </div>
        }
      />
      
      <AddMenuItemDialog
          isOpen={isAddEditDialogOpen}
          onOpenChange={setIsAddEditDialogOpen}
          onSaveItem={handleSaveMenuItem}
          existingItem={itemToEdit}
          trigger={null} 
      />

      <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-6">
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search products by title or description..."
                className="pl-10 h-10 w-full text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <ScrollArea className="mb-4 -mx-4 sm:mx-0">
            <div ref={categoriesContentRef} className="flex gap-2 px-4 sm:px-0 pb-3 select-none">
            {categories.map(cat => {
                const Icon = iconMap[cat.icon] || iconMap.Default;
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

        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="flex-1 -mx-4 sm:mx-0">
              <div className="space-y-4 px-4 sm:px-0 pb-6">
              {filteredItems.map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEditAdminAction={handleOpenEditDialog}
                    onDeleteAdminAction={handleDeleteMenuItem}
                    onToggleAvailabilityAdminAction={handleToggleAvailability}
                  />
              ))}
              {filteredItems.length === 0 && (
                  <p className="col-span-full text-center text-muted-foreground py-10">
                  No products match your criteria.
                  </p>
              )}
              </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
