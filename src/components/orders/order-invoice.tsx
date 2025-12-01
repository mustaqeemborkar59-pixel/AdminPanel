
"use client";

import React from 'react';
import { type Order } from '@/types';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';

interface OrderInvoiceProps {
  order: Order;
}

export const OrderInvoice = React.forwardRef<HTMLDivElement, OrderInvoiceProps>(({ order }, ref) => {
  return (
    <div ref={ref} className="p-8 font-sans text-gray-800 bg-white">
      <header className="flex justify-between items-start pb-6 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
          <p className="text-sm text-gray-500">Order #{order.id}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold text-gray-900">Online Shop Inc.</h2>
          <p className="text-sm text-gray-500">123 Market St, Suite 450</p>
          <p className="text-sm text-gray-500">Commerce City, CC 54321</p>
          <p className="text-sm text-gray-500">contact@onlineshop.com</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4 my-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
          <p className="font-medium text-gray-800">{order.customerName || 'N/A'}</p>
          {order.shippingAddress && <p className="text-sm text-gray-600">{order.shippingAddress}</p>}
          {order.gmail && <p className="text-sm text-gray-600">{order.gmail}</p>}
        </div>
        <div className="text-right">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Details</h3>
          <p className="text-sm text-gray-600"><span className="font-medium text-gray-700">Invoice Date:</span> {format(new Date(), 'PPP')}</p>
          <p className="text-sm text-gray-600"><span className="font-medium text-gray-700">Order Date:</span> {format(new Date(order.timestamp), 'PPP')}</p>
          <p className="text-sm text-gray-600"><span className="font-medium text-gray-700">Payment Method:</span> {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'N/A'}</p>
        </div>
      </section>

      <section className="my-6">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
              <th className="p-3 font-semibold">Item</th>
              <th className="p-3 text-center font-semibold">Quantity</th>
              <th className="p-3 text-right font-semibold">Unit Price</th>
              <th className="p-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.itemId} className="border-b">
                <td className="p-3">{item.name}</td>
                <td className="p-3 text-center">{item.qty}</td>
                <td className="p-3 text-right">₹{item.price.toFixed(2)}</td>
                <td className="p-3 text-right">₹{(item.price * item.qty).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="flex justify-end my-6">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-800">₹{order.subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium text-gray-800">₹{order.taxAmount.toFixed(2)}</span>
          </div>
          <Separator className="my-2 bg-gray-300" />
          <div className="flex justify-between text-base">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </section>
      
      <footer className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
        <p>If you have any questions, please contact us at contact@onlineshop.com.</p>
      </footer>
    </div>
  );
});
OrderInvoice.displayName = 'OrderInvoice';
