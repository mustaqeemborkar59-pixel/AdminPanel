
"use client";

import { PageHeader } from '@/components/page-header';
import { CustomerTable } from '@/components/customers/customer-table';
import type { Customer } from '@/types';

const customerData: Customer[] = [
  {
    id: 'CUST001',
    status: 'delivered',
    name: 'John Doe',
    phone: '123-456-7890',
    altPhone: '098-765-4321',
    billingAddress: '123 Main St, Anytown, USA',
    pincode: '12345',
    gmail: 'john.doe@example.com',
    products: [
      { name: 'Laptop Pro', qty: 1 },
      { name: 'Wireless Mouse', qty: 1 }
    ],
    total: 1354.50,
    date: '2023-05-01',
    paymentDate: '2023-05-01',
    trackingId: 'TRK123456789',
    vendorName: 'TechSupply Co.'
  },
    {
    id: 'CUST002',
    status: 'shipped',
    name: 'Jane Smith',
    phone: '234-567-8901',
    billingAddress: '456 Oak Ave, Somecity, USA',
    pincode: '54321',
    gmail: 'jane.smith@example.com',
    products: [
      { name: 'USB-C Hub', qty: 2 },
    ],
    total: 79.50,
    date: '2023-05-02',
    paymentDate: '2023-05-02',
    trackingId: 'TRK234567890',
    vendorName: 'Accessories Ltd.'
  },
  {
    id: 'CUST003',
    status: 'pending',
    name: 'Alice Johnson',
    phone: '345-678-9012',
    billingAddress: '789 Pine Ln, Otherville, USA',
    pincode: '67890',
    gmail: 'alice.j@example.com',
    products: [
      { name: 'Keyboard', qty: 1 },
    ],
    total: 70.00,
    date: '2023-05-03',
    paymentDate: '2023-05-03',
    trackingId: undefined,
    vendorName: 'Local Electronics'
  },
  {
    id: 'CUST004',
    status: 'cancelled',
    name: 'Robert Brown',
    phone: '456-789-0123',
    billingAddress: '101 Maple Dr, New Place, USA',
    pincode: '13579',
    gmail: 'rob.brown@example.com',
    products: [
        { name: 'Webcam', qty: 1 }
    ],
    total: 15.00,
    date: '2023-05-04',
    paymentDate: '2023-05-04',
    trackingId: 'TRK456789012',
    vendorName: 'Vision Best'
  }
];

export default function CustomersPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Customers"
        description="View and manage customer order details."
      />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <CustomerTable customers={customerData} />
      </div>
    </div>
  );
}
