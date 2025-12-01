
"use client";

import React from 'react';
import { type Order } from '@/types';
import { OrderInvoice } from './order-invoice';

interface OrderInvoicesForPrintProps {
  orders: Order[];
}

export const OrderInvoicesForPrint = React.forwardRef<HTMLDivElement, OrderInvoicesForPrintProps>(({ orders }, ref) => {
  return (
    <div ref={ref}>
      {orders.map((order, index) => (
        <div key={order.id} style={{ pageBreakAfter: index < orders.length - 1 ? 'always' : 'auto' }}>
          <OrderInvoice order={order} />
        </div>
      ))}
    </div>
  );
});

OrderInvoicesForPrint.displayName = 'OrderInvoicesForPrint';
