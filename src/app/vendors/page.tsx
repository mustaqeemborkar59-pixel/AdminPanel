
"use client";
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import type { Vendor } from '@/types';
import { VendorsTable } from '@/components/vendors/vendors-table';
import { AddVendorDialog } from '@/components/vendors/add-vendor-dialog';

// Initial static data for vendors
const initialVendors: Vendor[] = [
  { id: 'VEND001', code: 'ST_GI', name: 'Sakib Traders' },
  { id: 'VEND002', code: 'AZ_Fash', name: 'A-Z Fashion' },
  { id: 'VEND003', code: 'LeoEnt', name: 'Leo Enterprises' },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);

  const handleAddVendor = (newVendor: Omit<Vendor, 'id'>) => {
    setVendors(prev => [...prev, { ...newVendor, id: `VEND${String(Date.now()).slice(-4)}` }]);
  };

  const handleEditVendor = (updatedVendor: Vendor) => {
     setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
  };

  const handleDeleteVendor = (vendorId: string) => {
    setVendors(prev => prev.filter(v => v.id !== vendorId));
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Vendor Management"
        description="Manage your product vendors and their codes."
        actions={
            <AddVendorDialog onAddVendor={handleAddVendor} />
        }
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <VendorsTable 
            vendors={vendors} 
            onEditVendor={handleEditVendor} 
            onDeleteVendor={handleDeleteVendor}
        />
      </div>
    </div>
  );
}
