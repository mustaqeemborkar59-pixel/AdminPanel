
"use client";
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import type { Vendor } from '@/types';
import { VendorsTable } from '@/components/vendors/vendors-table';
import { AddVendorDialog } from '@/components/vendors/add-vendor-dialog';
import { getVendorsFromRTDB, saveVendorToRTDB, deleteVendorFromRTDB } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      const result = await getVendorsFromRTDB();
      if (result.success && result.data) {
        setVendors(result.data);
      } else if (!result.success) {
        toast({
          variant: "destructive",
          title: "Failed to load vendors",
          description: result.error || "Could not fetch vendors from the database.",
        });
      }
      setIsLoading(false);
    };
    fetchVendors();
  }, [toast]);

  const refreshVendors = async () => {
    const result = await getVendorsFromRTDB();
    if (result.success && result.data) {
      setVendors(result.data);
    }
  }

  const handleAddVendor = async (newVendorData: Omit<Vendor, 'id'>) => {
    const result = await saveVendorToRTDB(newVendorData);
    if (result.success) {
      toast({ title: "Vendor Added", description: `${newVendorData.name} has been added.` });
      await refreshVendors();
    } else {
      toast({ variant: "destructive", title: "Failed to Add", description: result.error });
    }
  };

  const handleEditVendor = async (updatedVendor: Vendor) => {
    const result = await saveVendorToRTDB(updatedVendor, updatedVendor.id);
     if (result.success) {
      toast({ title: "Vendor Updated", description: `${updatedVendor.name} has been updated.` });
      await refreshVendors();
    } else {
      toast({ variant: "destructive", title: "Failed to Update", description: result.error });
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    const result = await deleteVendorFromRTDB(vendorId);
    if (result.success) {
      toast({ title: "Vendor Deleted", description: "The vendor has been removed." });
      await refreshVendors();
    } else {
      toast({ variant: "destructive", title: "Failed to Delete", description: result.error });
    }
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
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <VendorsTable 
                vendors={vendors} 
                onEditVendor={handleEditVendor} 
                onDeleteVendor={handleDeleteVendor}
            />
        )}
      </div>
    </div>
  );
}

    