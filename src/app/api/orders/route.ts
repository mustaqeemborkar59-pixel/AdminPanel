
'use server';
import { NextResponse } from 'next/server';
import type { Order, OrderItem, OrderStatus } from '@/types';

// Robust mapping function to prevent crashes from unexpected data.
// This function remains unchanged as it's not part of the fetching logic.
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
      'in-transit': 'in-transit',
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
      paymentMethod: order.payment_method, // The slug e.g. "cod"
      paymentMethodTitle: order.payment_method_title, // The title e.g. "Cash on Delivery"
      paymentDate: order.date_paid_gmt ? `${order.date_paid_gmt}Z` : null,
      vendorName: lineItems.length > 0 ? lineItems[0].vendorName : undefined,
    };
  } catch (error) {
    console.error(`Error mapping order ID ${order.id}:`, error);
    return null; // Return null if a single order fails to map
  }
};


export async function GET(request: Request) {
  // STEP 1: Validate server-side credentials
  const storeUrl = process.env.WOOCOMMERCE_STORE_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!storeUrl || !consumerKey || !consumerSecret) {
    const errorMessage = 'Connection to WooCommerce failed. The API credentials (URL, Key, Secret) are not configured correctly on the server. Please check the .env file.';
    console.error("Authentication Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  // STEP 2: Build a secure and robust request
  try {
    // Validate and clean the store URL
    const cleanedStoreUrl = storeUrl.replace(/\/+$/, '');
    new URL(cleanedStoreUrl); // Throws an error if URL is invalid

    // Create a secure Basic Auth header. This is safer than query parameters.
    const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`;

    // Forward relevant query parameters from the client to the WooCommerce API
    const { searchParams } = new URL(request.url);
    const apiParams = new URLSearchParams({
      per_page: '100',
      orderby: 'date',
      order: 'desc',
    });
    
    // **FIXED LOGIC**: Only set the 'status' parameter if a specific status is provided.
    // If 'any' is passed or the parameter is missing, we omit it, and WooCommerce defaults to 'any'.
    const clientStatus = searchParams.get('status');
    if (clientStatus && clientStatus !== 'any') {
      apiParams.set('status', clientStatus);
    }
    
    if (searchParams.get('after')) apiParams.set('after', searchParams.get('after')!);
    if (searchParams.get('before')) apiParams.set('before', searchParams.get('before')!);
    if (searchParams.get('modified_after')) apiParams.set('modified_after', searchParams.get('modified_after')!);
    if (searchParams.get('modified_before')) apiParams.set('modified_before', searchParams.get('modified_before')!);
    if (searchParams.get('search')) apiParams.set('search', searchParams.get('search')!);
    if (searchParams.get('page')) apiParams.set('page', searchParams.get('page')!);

    const requestUrl = `${cleanedStoreUrl}/wp-json/wc/v3/orders?${apiParams.toString()}`;
    
    console.log("Requesting data from WooCommerce URL:", requestUrl);

    // STEP 3: Fetch data and handle response carefully
    const response = await fetch(requestUrl, {
        headers: {
            'Authorization': authHeader,
        },
        cache: 'no-store', // Always get fresh data
    });

    // First, get the response as raw text to check for HTML
    const responseText = await response.text();

    // Log the beginning of the raw response for debugging
    console.log("Raw WooCommerce Response (first 500 chars):", responseText.substring(0, 500));

    // CRITICAL: Check if the response is HTML, which indicates a configuration error.
    if (responseText.trim().startsWith('<')) {
        const htmlError = "The WooCommerce API returned an HTML page instead of JSON data. This usually means the 'WOOCOMMERCE_STORE_URL' in your .env file is incorrect, or a plugin/server issue is interfering. Please verify the URL is your base WordPress URL (e.g., https://yourstore.com) and that your Permalink settings are set to 'Post name'.";
        console.error("WooCommerce Connection Error:", htmlError);
        return NextResponse.json({ error: htmlError }, { status: 500 });
    }

    // Now that we know it's not HTML, try to parse it as JSON
    let fetchedData;
    try {
        fetchedData = JSON.parse(responseText);
    } catch (jsonError) {
        const parseError = `The WooCommerce API returned a response that was not valid JSON. This could indicate a server error on your store's side. Please check your WooCommerce status logs.`;
        console.error("JSON Parsing Error:", parseError);
        return NextResponse.json({ error: parseError }, { status: 500 });
    }
    
    // Check for API errors returned in a valid JSON format
    if (fetchedData.code && fetchedData.message) {
      let detail = fetchedData.message;
      if (fetchedData.code === 'woocommerce_rest_authentication_error') {
          detail = "Authentication with WooCommerce failed (Unauthorized). Please check your WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET in the .env file.";
      }
      console.error("WooCommerce API Error:", detail);
      return NextResponse.json({ error: `WooCommerce API Error: ${detail}` }, { status: 500 });
    }

    // STEP 4: Map and return the clean data
    const mappedOrders = (fetchedData as any[])
      .map(order => mapWCOrderToAppOrder(order))
      .filter((order): order is Order => order !== null);

    return NextResponse.json(mappedOrders);

  } catch (error: any) {
    // Catch-all for other errors like invalid URL format or network issues
    console.error("!!! WooCommerce API Route Error !!!");
    console.error("Underlying Error:", error);

    let errorMessage;
    const errorStoreUrl = process.env.WOOCOMMERCE_STORE_URL || '[URL not set]';

    if (error.message?.includes('Invalid URL')) {
        errorMessage = `The URL provided (${errorStoreUrl}) is invalid. Please check the WOOCOMMERCE_STORE_URL in your .env file.`;
    } else if (error.code === 'ENOTFOUND') {
        errorMessage = `Could not find the host (${errorStoreUrl}). Please ensure the domain name is correct and the server is running.`;
    } else if (error.code === 'ECONNREFUSED') {
        errorMessage = `Connection was refused by the server at ${errorStoreUrl}. Please check if your store is online and not blocked by a firewall.`;
    } else {
        // For any other fetch-related error, return the underlying error message.
        // This is much more informative than a generic message.
        // It could reveal issues like SSL errors, timeouts, etc.
        errorMessage = error.message || 'An unknown network error occurred during the API request.';
    }
    
    return NextResponse.json({ error: `WooCommerce Connection Error: ${errorMessage}` }, { status: 500 });
  }
}
