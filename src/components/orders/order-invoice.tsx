
"use client";

import React from 'react';
import { type Order } from '@/types';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';

interface OrderInvoiceProps {
  order: Order;
}

// This component is now deprecated and can be removed, but we'll clear its content
// to avoid any lingering references or errors. It is no longer used by the new export system.
export const OrderInvoice = React.forwardRef<HTMLDivElement, OrderInvoiceProps>(({ order }, ref) => {
    return null;
});
OrderInvoice.displayName = 'OrderInvoice';
