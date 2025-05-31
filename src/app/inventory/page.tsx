
"use client";
import { useState, type ReactNode, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { type InventoryItem } from '@/types';
import { Input } from '@/components/ui/input';
import { AddInventoryItemDialog } from '@/components/inventory/add-inventory-item-dialog';
import { InventoryTable } from '@/components/inventory/inventory-table';

const initialInventoryItems: InventoryItem[] = [
  { id: 'INV001', name: 'Tomatoes', quantity: 50, unit: 'kg', alertLevel: 10, vendor: 'Fresh Farms Co.' },
  { id: 'INV002', name: 'Pasta', quantity: 100, unit: 'kg', alertLevel: 20, vendor: 'Italian Imports' },
  { id: 'INV003', name: 'Olive Oil', quantity: 20, unit: 'liters', alertLevel: 5, vendor: 'Organic Oils Ltd.' },
  { id: 'INV004', name: 'Chicken Breast', quantity: 30, unit: 'kg', alertLevel: 10, vendor: 'Local Butchers' },
  { id: 'INV005', name: 'Mozzarella Cheese', quantity: 15, unit: 'kg', alertLevel: 5, vendor: 'Dairy Best' },
];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setInventoryItems(initialInventoryItems);
  }, []);

  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    setInventoryItems(prevItems => [...prevItems, { ...newItem, id: `INV${String(Date.now()).slice(-4)}` }]);
  };

  const handleEditItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleDeleteItem = (itemId: string) => {
    setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Inventory Control"
        description="Track stock levels, manage ingredients, and vendor information."
        actions={<AddInventoryItemDialog onAddItem={handleAddItem} />}
      />
      <div className="p-4 md:p-6 space-y-4">
         <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory items..."
              className="pl-10 w-full md:max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>
      <div className="flex-1 px-4 md:px-6 pb-6 overflow-auto">
        <InventoryTable
          items={filteredItems}
          onEditItem={(item) => {
            // For edit, can trigger a dialog prefilled with item data
            console.log("Editing item:", item);
            // Example: setSelectedItemForEdit(item); setIsEditDialogOpen(true);
          }}
          onDeleteItem={handleDeleteItem}
        />
      </div>
    </div>
  );
}
