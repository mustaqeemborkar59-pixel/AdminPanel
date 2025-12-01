
"use client";

import React from 'react';
import { type Order } from '@/types';
import { OrderInvoice } from './order-invoice';

interface OrderInvoicesForPrintProps {
  orders: Order[];
}

// This component is now deprecated and can be removed, but we'll clear its content
// to avoid any lingering references or errors. It is no longer used by the new export system.
export const OrderInvoicesForPrint = React.forwardRef<HTMLDivElement, OrderInvoicesForPrintProps>(({ orders }, ref) => {
  return null;
});

OrderInvoicesForPrint.displayName = 'OrderInvoicesForPrint';
