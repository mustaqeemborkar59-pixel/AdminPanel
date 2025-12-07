
import type { Vendor } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AddVendorDialog } from './add-vendor-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface VendorsTableProps {
  vendors: Vendor[];
  onEditVendor: (vendor: Vendor) => Promise<void>;
  onDeleteVendor: (vendorId: string) => Promise<void>;
}

export function VendorsTable({ vendors, onEditVendor, onDeleteVendor }: VendorsTableProps) {
  if (vendors.length === 0) {
    return <div className="text-center py-12 font-body text-muted-foreground">No vendors found. Add one to get started.</div>;
  }

  return (
    <Card className="shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-headline">Vendor Name</TableHead>
            <TableHead className="font-headline">Vendor Code</TableHead>
            <TableHead className="text-right font-headline">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id} className="font-body hover:bg-muted/50">
              <TableCell className="font-medium">{vendor.name}</TableCell>
              <TableCell className="font-mono text-sm">{vendor.code}</TableCell>
              <TableCell className="text-right">
                <AddVendorDialog 
                  existingVendor={vendor} 
                  onAddVendor={async (editedVendorData) => {
                    const vendorToUpdate: Vendor = { ...vendor, ...editedVendorData };
                    await onEditVendor(vendorToUpdate);
                  }} 
                  triggerButton={
                    <Button variant="ghost" size="icon" className="mr-2">
                        <Edit className="h-4 w-4" />
                    </Button>
                }/>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the vendor <span className="font-semibold">{vendor.name}</span>. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteVendor(vendor.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
