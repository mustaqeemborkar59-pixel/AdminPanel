'use server';
import { NextResponse } from 'next/server';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { Order, OrderItem, OrderStatus } from '@/types';

// This function is self-contained to avoid external dependencies issues.
const getWooCommerceApi = (): WooCommerceRestApi => {
  const storeUrl = process.env.WOOCOMMERCE_STORE_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!storeUrl || !consumerKey || !consumerSecret) {
    throw new Error('WooCommerce API credentials are not configured on the server.');
  }

  return new WooCommerceRestApi({
    url: storeUrl,
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    version: "wc/v3",
    timeout: 60000,
  });
};

// Robust mapping function to prevent crashes from unexpected data.
const mapWCOrderToAppOrder = (order: any): Order | null => {
  try {
    const lineItems: OrderItem[] = (order.line_items || []).map((item: any): OrderItem => {
      // The vendor code is the part of the SKU before the first hyphen.
      const sku = item.sku || '';
      const vendorCode = sku.split('-')[0] || undefined;

      return {
        itemId: String(item.product_id),
        name: item.name || 'Unknown Item',
        sku: item.sku || undefined, // Keep original sku
        qty: item.quantity || 0,
        price: parseFloat(item.price || '0'),
        imageUrl: item.image?.src,
        vendorName: vendorCode, // This now holds the extracted vendor code.
      };
    });

    const getMetaValue = (key: string) => {
      const meta = (order.meta_data || []).find((m: any) => m.key === key);
      return meta ? meta.value : undefined;
    };

    const statusMap: { [key: string]: OrderStatus } = {
      'pending': 'pending', 'processing': 'processing', 'on-hold': 'hold',
      'completed': 'completed', 'cancelled': 'cancelled', 'failed': 'failed',
      'refunded': 'failed', 'queue': 'queue', 'dispatch': 'dispatch',
    };
    const appStatus = statusMap[order.status] || 'pending';

    const formatAddress = (addr: any) => {
      if (!addr) return '';
      const parts = [addr.address_1, addr.address_2, addr.city, addr.state, addr.postcode, addr.country];
      return parts.filter(Boolean).join(', ');
    };
    
    const subTotal = lineItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return {
      id: String(order.id),
      parentId: order.parent_id || 0,
      customerName: `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() || 'N/A',
      phone: order.billing?.phone,
      altPhone: getMetaValue('_billing_alternate_phone'),
      pincode: order.billing?.postcode,
      gmail: order.billing?.email,
      items: lineItems,
      status: appStatus,
      orderType: 'delivery',
      billingAddress: formatAddress(order.billing),
      billing_city: order.billing?.city,
      billing_state: order.billing?.state,
      billing_country: order.billing?.country,
      shippingAddress: formatAddress(order.shipping),
      trackingId: getMetaValue('_wc_shipment_tracking_items')?.[0]?.tracking_number,
      totalAmount: parseFloat(order.total || '0'),
      taxAmount: parseFloat(order.total_tax || '0'),
      subTotal: subTotal,
      timestamp: order.date_created_gmt ? `${order.date_created_gmt}Z` : new Date().toISOString(),
      paymentMethod: 'card',
      paymentDate: order.date_paid_gmt ? `${order.date_paid_gmt}Z` : null,
      vendorName: lineItems.length > 0 ? lineItems[0].vendorName : undefined,
    };
  } catch (error) {
    console.error(`Error mapping order ID ${order.id}:`, error);
    return null; // Return null if a single order fails to map
  }
};


export async function GET(request: Request) {
  try {
    const api = getWooCommerceApi();
    const { searchParams } = new URL(request.url);

    // Parameters for WooCommerce API
    const params: any = {
      per_page: 100,
      orderby: 'date',
      order: 'desc',
    };

    // Apply filters from the request to the parameters
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== 'any') {
      params.status = statusParam;
    } else {
      // To be robust against server default configs, if 'any' or no status is specified,
      // explicitly request all main statuses.
      params.status = ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'failed'].join(',');
    }
    
    if (searchParams.get('after')) {
      params.after = searchParams.get('after');
    }
    if (searchParams.get('before')) {
      params.before = searchParams.get('before');
    }
    if (searchParams.get('search')) {
      params.search = searchParams.get('search');
    }
    // FIX: Add page parameter handling for pagination
    if (searchParams.get('page')) {
      params.page = searchParams.get('page');
    }

    const response = await api.get("orders", params);

    if (response.status !== 200) {
      console.error(`WooCommerce API Error:`, response.data);
      throw new Error(`WooCommerce API responded with status ${response.status}`);
    }
    
    const fetchedOrders = response.data;
    
    // Map the fetched raw data to our app's Order type, filtering out any that fail to map
    const mappedOrders = fetchedOrders
      .map((order: any) => mapWCOrderToAppOrder(order))
      .filter((order: Order | null): order is Order => order !== null);

    return NextResponse.json(mappedOrders);

  } catch (error: any) {
    console.error('Failed to fetch orders from custom API route:', error);
    // Provide a more specific error message if available
    const errorMessage = error.response?.data?.message || error.message || 'An internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
