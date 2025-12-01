'use server';

import { revalidatePath } from 'next/cache';
import { getOrders, updateOrderStatus } from '@/lib/google-sheets';
import type { Order, OrderStatus } from '@/types';

// Server action to get all orders from the sheet
export async function getOrdersFromSheet(): Promise<{ success: boolean; data?: Order[], error?: string }> {
  try {
    const orders = await getOrders();
    // Sort by timestamp descending to show newest orders first
    orders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return { success: true, data: orders };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error("Server Action Error (getOrdersFromSheet):", errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Server action to update an order's status
export async function updateOrderStatusInSheet(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
   try {
    const wasSuccessful = await updateOrderStatus(orderId, status);
    if (wasSuccessful) {
      revalidatePath('/orders'); // Revalidate the orders page to show the update
      return { success: true };
    } else {
      return { success: false, error: `Order ID ${orderId} not found or failed to update.` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error("Server Action Error (updateOrderStatusInSheet):", errorMessage);
    return { success: false, error: errorMessage };
  }
}

    