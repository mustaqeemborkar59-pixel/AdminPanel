
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Order, OrderItem, OrderStatus, type UpdateOrderAddressPayload, type MenuItem } from '@/types';

// This function will be called every time we need the API instance.
const getWooCommerceApi = (): WooCommerceRestApi => {
  const storeUrl = process.env.WOOCOMMERCE_STORE_URL;
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

  if (!storeUrl || !consumerKey || !consumerSecret) {
    console.error('CRITICAL: WooCommerce server-side environment variables are not set correctly.');
    throw new Error('WooCommerce API credentials are not configured on the server. Please check your .env file.');
  }

  try {
    new URL(storeUrl); // Validate URL format
    return new WooCommerceRestApi({
      url: storeUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: "wc/v3",
      timeout: 60000,
    });
  } catch (error) {
    console.error("Failed to initialize WooCommerce API.", error);
    if (error instanceof TypeError) {
      throw new Error(`Invalid WooCommerce store URL format: ${storeUrl}`);
    }
    throw error;
  }
};

const mapWCOrderToAppOrder = (order: any): Order => {
  const lineItems: OrderItem[] = (order.line_items || []).map((item: any): OrderItem => {
    // Safely find vendor name from meta data
    const vendorMeta = (item.meta_data || []).find((meta: any) => meta.key === 'vendor');
    const vendorName = vendorMeta ? vendorMeta.value : undefined;

    return {
      itemId: String(item.product_id),
      name: item.name || 'Unknown Item',
      sku: item.sku || undefined,
      qty: item.quantity || 0,
      price: parseFloat(item.price || '0'),
      imageUrl: item.image?.src,
      vendorName: vendorName,
    };
  });

  const getMetaValue = (key: string) => {
    const meta = (order.meta_data || []).find((m: any) => m.key === key);
    return meta ? meta.value : undefined;
  };

  const statusMap: { [key: string]: OrderStatus } = {
    'pending': 'pending',
    'processing': 'processing',
    'on-hold': 'hold',
    'completed': 'completed',
    'cancelled': 'cancelled',
    'failed': 'failed',
    'refunded': 'failed', // map refunded to a known status
    'queue': 'queue',
    'dispatch': 'dispatch',
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
    customerName: `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() || 'N/A',
    phone: order.billing?.phone || undefined,
    altPhone: getMetaValue('_billing_alternate_phone'),
    pincode: order.billing?.postcode || undefined,
    gmail: order.billing?.email || undefined,
    items: lineItems,
    status: appStatus,
    orderType: 'delivery', // Defaulting as WC doesn't have this concept out of box
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
    paymentMethod: 'card', // Placeholder
    paymentDate: order.date_paid_gmt ? `${order.date_paid_gmt}Z` : null,
    vendorName: lineItems.length > 0 ? lineItems[0].vendorName : undefined, // Top level vendor for simplicity
  };
};

// This function now returns mapped and validated Order objects
export const getOrders = async (): Promise<Order[]> => {
  const api = getWooCommerceApi();
  let allOrders: Order[] = [];
  let page = 1;
  const perPage = 100;
  let keepFetching = true;

  while (keepFetching) {
    try {
      const response = await api.get("orders", {
        per_page: perPage,
        page: page,
        orderby: 'date',
        order: 'desc',
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch orders on page ${page}. Status: ${response.status} ${response.statusText}`);
      }

      const rawOrders = response.data;
      
      const mappedOrders: Order[] = rawOrders.map((order: any) => {
        try {
          // Map each order inside a try-catch to isolate errors
          return mapWCOrderToAppOrder(order);
        } catch (mapError) {
          console.error(`Skipping order ${order.id} due to mapping error:`, mapError);
          return null; // Return null for failed mappings
        }
      }).filter((order: Order | null): order is Order => order !== null); // Filter out nulls
      
      allOrders = allOrders.concat(mappedOrders);

      if (rawOrders.length < perPage) {
        keepFetching = false;
      } else {
        page++;
      }

    } catch (error: any) {
      console.error(`Error fetching orders from WooCommerce on page ${page}:`, error.response?.data || error.message);
      // Stop fetching on any API error to prevent infinite loops
      keepFetching = false; 
      throw new Error(error.response?.data?.message || error.message || 'An unknown error occurred during API communication.');
    }
  }
  return allOrders;
};


export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
   const api = getWooCommerceApi(); // Get a fresh API instance
   try {
    const response = await api.put(`orders/${orderId}`, {
      status: status
    });

    return response.status === 200;
  } catch (error) {
    console.error(`Failed to update order ${orderId} status in WooCommerce:`, error);
    throw new Error('Failed to update order status in WooCommerce.');
  }
};

export const updateOrderAddress = async (orderId: string, payload: UpdateOrderAddressPayload): Promise<boolean> => {
  const api = getWooCommerceApi(); // Get a fresh API instance
  try {
    const data: { billing: Partial<UpdateOrderAddressPayload> } = {
      billing: {}
    };

    // Correctly define the keys to include 'alternate_phone'
    const fields: (keyof UpdateOrderAddressPayload)[] = [
      'first_name', 'last_name', 'address_1', 'address_2', 
      'city', 'state', 'postcode', 'country', 
      'email', 'phone', 'alternate_phone'
    ];
    
    fields.forEach(field => {
      if (payload[field] !== undefined) {
        (data.billing as any)[field] = payload[field];
      }
    });

    if (Object.keys(data.billing).length === 0) {
      console.log("No address data to update.");
      return true;
    }
    
    const response = await api.put(`orders/${orderId}`, data);
    return response.status === 200;
  } catch (error) {
    console.error(`Failed to update order ${orderId} address in WooCommerce:`, error);
    throw new Error('Failed to update order address in WooCommerce.');
  }
};

const mapWCProductToMenuItem = (product: any): MenuItem => {
  const isSale = product.on_sale && product.sale_price;

  return {
    id: String(product.id),
    name: product.name,
    price: parseFloat(isSale ? product.sale_price : product.regular_price || product.price || '0'),
    regularPrice: isSale && parseFloat(product.regular_price) > parseFloat(product.sale_price)
      ? parseFloat(product.regular_price)
      : undefined,
    category: product.categories.length > 0 ? product.categories[0].name : 'Uncategorized',
    imageUrl: product.images.length > 0 ? product.images[0].src : undefined,
    availability: product.stock_status === 'instock',
    description: product.short_description ? product.short_description.replace(/<[^>]*>?/gm, '') : product.description ? product.description.replace(/<[^>]*>?/gm, '') : undefined,
  };
}

export const getProducts = async (): Promise<MenuItem[]> => {
  const api = getWooCommerceApi(); // Get a fresh API instance

  try {
    let allProducts: any[] = [];
    let page = 1;
    const perPage = 100;
    let keepFetching = true;

    while(keepFetching) {
      const response = await api.get("products", {
        per_page: perPage,
        page: page,
      });

      if (response?.request?.res?.statusCode !== 200) {
        const status = response?.request?.res?.statusCode;
        const statusText = response?.request?.res?.statusMessage;
        throw new Error(`Failed to fetch products on page ${page}. Status: ${status} ${statusText}`);
      }

      const fetchedProducts = response.data;
      allProducts = allProducts.concat(fetchedProducts);

      if (fetchedProducts.length < perPage) {
        keepFetching = false;
      } else {
        page++;
      }
    }
    
    const products: MenuItem[] = allProducts.map(mapWCProductToMenuItem);
    return products;
  } catch (error: any) {
    console.error("Error fetching products from WooCommerce:", error);
    if (error.code === 'ENOTFOUND' || (error.message && error.message.includes('getaddrinfo ENOTFOUND'))) {
       throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file.`);
    }
    throw new Error('Failed to communicate with WooCommerce API to fetch products.');
  }
};
