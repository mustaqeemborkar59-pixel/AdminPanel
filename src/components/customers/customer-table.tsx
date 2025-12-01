
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface CustomerTableProps {
  customers: Customer[];
}

const statusColors: Record<Customer['status'], string> = {
  pending: 'bg-yellow-500/80 border-yellow-600/80 text-yellow-900',
  shipped: 'bg-blue-500/80 border-blue-600/80 text-blue-900',
  delivered: 'bg-green-500/80 border-green-600/80 text-green-900',
  cancelled: 'bg-red-500/80 border-red-600/80 text-red-900',
};

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <Card className="shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Alternate Phone</TableHead>
            <TableHead>Billing</TableHead>
            <TableHead>Pincode</TableHead>
            <TableHead>Gmail</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Tracking ID</TableHead>
            <TableHead>Vendor Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{customer.id}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusColors[customer.status])}
                >
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.altPhone || 'N/A'}</TableCell>
              <TableCell>{customer.billingAddress}</TableCell>
              <TableCell>{customer.pincode}</TableCell>
              <TableCell>{customer.gmail}</TableCell>
              <TableCell>
                {customer.products.map(p => `${p.name} (x${p.qty})`).join(', ')}
              </TableCell>
              <TableCell>${customer.total.toFixed(2)}</TableCell>
              <TableCell>{customer.date}</TableCell>
              <TableCell>{customer.paymentDate}</TableCell>
              <TableCell>{customer.trackingId || 'N/A'}</TableCell>
              <TableCell>{customer.vendorName || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
