
'use server';

import { revalidatePath } from 'next/cache';
import { updateOrderStatus, updateOrderAddress } from '@/lib/woocommerce';
import type { Order, OrderStatus, UpdateOrderAddressPayload } from '@/types';

// Server action to update an order's status in WooCommerce
export async function updateOrderStatusInWooCommerce(orderId: string, status: OrderStatus): Promise<{ success: boolean; error?: string }> {
   try {
    const wasSuccessful = await updateOrderStatus(orderId, status);
    if (wasSuccessful) {
      revalidatePath('/orders'); // Revalidate the orders page to show the update
      revalidatePath('/api/orders'); // Also revalidate the API route
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


// Server action to update an order's billing address in WooCommerce
export async function updateOrderAddressInWooCommerce(orderId: string, payload: UpdateOrderAddressPayload): Promise<{ success: boolean; error?: string }> {
   try {
    const wasSuccessful = await updateOrderAddress(orderId, payload);
    if (wasSuccessful) {
      revalidatePath('/orders');
      revalidatePath('/api/orders'); // Also revalidate the API route
      return { success: true };
    } else {
      return { success: false, error: `Order ID ${orderId} not found or failed to update address in WooCommerce.` };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error("Server Action Error (updateOrderAddressInWooCommerce):", errorMessage);
    return { success: false, error: errorMessage };
  }
}
