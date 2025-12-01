
"use client";

import React from 'react';
import { type Order } from '@/types';
import { OrderInvoice } from './order-invoice';

interface OrderInvoicesForPrintProps {
  orders: Order[];
}

export const OrderInvoicesForPrint = React.forwardRef<HTMLDivElement, OrderInvoicesForPrintProps>(({ orders }, ref) => {
  if (!orders || orders.length === 0) {
    return null;
  }
  
  return (
    <div ref={ref}>
      {orders.map((order, index) => (
        <div key={order.id} className={index < orders.length - 1 ? 'page-break-after' : ''}>
          <OrderInvoice order={order} />
        </div>
      ))}
      <style jsx global>{`
        .page-break-after {
          page-break-after: always;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
});

OrderInvoicesForPrint.displayName = 'OrderInvoicesForPrint';
