
'use server';

import { getProducts } from '@/lib/woocommerce';
import type { MenuItem } from '@/types';

// Server action to get all products from WooCommerce
export async function getProductsFromWooCommerce(): Promise<{ success: boolean; data?: MenuItem[], error?: string }> {
  try {
    const products = await getProducts();
    return { success: true, data: products };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    console.error("Server Action Error (getProductsFromWooCommerce):", errorMessage);
    return { success: false, error: errorMessage };
  }
}
