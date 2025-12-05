
'use server';

import { revalidatePath } from 'next/cache';
import { getOrders, updateOrderStatus } from '@/lib/woocommerce';
import type { Order, OrderStatus } from '@/types';

// Server action to get all orders from WooCommerce
export async function getOrdersFromWooCommerce(): Promise<{ success: boolean; data?: Order[], error?: string }> {
  try {
    const orders = await getOrders();
    return { success: true, data: orders };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error("Server Action Error (getOrdersFromWooCommerce):", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Server action to update an order's status in WooCommerce
export async function updateOrderStatusInWooCommerce(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
   try {
    const wasSuccessful = await updateOrderStatus(orderId, status);
    if (wasSuccessful) {
      revalidatePath('/orders'); // Revalidate the orders page to show the update
      return { success: true };
    } else {
      return { success: false, error: `Order ID ${orderId} not found or failed to update in WooCommerce.` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error("Server Action Error (updateOrderStatusInWooCommerce):", errorMessage);
    return { success: false, error: errorMessage };
  }
}
