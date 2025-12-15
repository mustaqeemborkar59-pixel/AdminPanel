

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Order, OrderItem, OrderStatus, type UpdateOrderAddressPayload, type MenuItem } from '@/types';

// Check if the required environment variables are available at runtime.
const isWooCommerceConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL &&
    process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL !== 'https://your-store-url.com' &&
    process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY &&
    process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET
  );
};


let api: WooCommerceRestApi | undefined;

if (isWooCommerceConfigured()) {
  try {
    // Basic validation to ensure the URL is somewhat valid before initializing
    new URL(process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL!);
    api = new WooCommerceRestApi({
      url: process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL!,
      consumerKey: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET!,
      version: "wc/v3",
      timeout: 60000, // 60-second timeout
    });
  } catch (error) {
    console.error("Failed to initialize WooCommerce API. Please check the store URL in your .env file.", error);
    api = undefined;
  }
}

const formatAddress = (address: any): string => {
  if (!address || !Object.keys(address).some(key => address[key])) {
    return '';
  }
  const addressParts = [
    address.address_1,
    address.address_2,
    address.city,
    address.state,
    address.postcode,
    address.country
  ];
  return addressParts.filter(part => part).join(', ');
};

const mapWCOrderToAppOrder = (wcOrder: any): Order => {
  let primaryVendorName: string | undefined = undefined;

  const items: OrderItem[] = (wcOrder.line_items || []).map((item: any) => {
    let itemVendorName: string | undefined = undefined;
    if (item.sku && typeof item.sku === 'string' && item.sku.includes('-')) {
      itemVendorName = item.sku.split('-')[0];
      if (!primaryVendorName) {
        primaryVendorName = itemVendorName;
      }
    }
    return {
      itemId: String(item.product_id),
      name: item.name,
      qty: item.quantity,
      price: parseFloat(item.price),
      imageUrl: item.image?.src || '',
      vendorName: itemVendorName,
    };
  });

  const subTotal = parseFloat(wcOrder.total) - parseFloat(wcOrder.total_tax);
  const billingAddress = formatAddress(wcOrder.billing);
  const shippingAddress = formatAddress(wcOrder.shipping);

  // Find alternate phone from meta data
  const altPhoneMeta = wcOrder.meta_data.find((m: any) => m.key === '_billing_alternate_phone');
  const altPhone = altPhoneMeta ? altPhoneMeta.value : undefined;


  return {
    id: String(wcOrder.id),
    customerName: `${wcOrder.billing.first_name} ${wcOrder.billing.last_name}`,
    phone: wcOrder.billing.phone,
    altPhone: altPhone, // Assign the found alternate phone number
    pincode: wcOrder.billing.postcode,
    gmail: wcOrder.billing.email,
    items: items,
    status: wcOrder.status as OrderStatus,
    orderType: 'delivery', // Defaulting to delivery
    billingAddress: billingAddress,
    billing_city: wcOrder.billing.city,
    billing_state: wcOrder.billing.state,
    billing_country: wcOrder.billing.country,
    shippingAddress: shippingAddress,
    trackingId: wcOrder.meta_data.find((m: any) => m.key === '_wc_shipment_tracking_items')?.value[0]?.tracking_number || '',
    totalAmount: parseFloat(wcOrder.total),
    subTotal: subTotal,
    taxAmount: parseFloat(wcOrder.total_tax),
    timestamp: wcOrder.date_created_gmt + 'Z',
    paymentMethod: wcOrder.payment_method_title,
    paymentDate: wcOrder.date_paid_gmt ? wcOrder.date_paid_gmt + 'Z' : null,
    vendorName: primaryVendorName
  };
};

export const getOrders = async (): Promise<Order[]> => {
  if (!api || !isWooCommerceConfigured()) {
    // Throw an error that will be caught by the server action and displayed to the user.
    throw new Error('WooCommerce environment variables are not set correctly. Please check your .env file and ensure WOOCOMMERCE_STORE_URL, WOOCOMMERCE_CONSUMER_KEY, and WOOCOMMERCE_CONSUMER_SECRET are set correctly.');
  }
  
  try {
    let allWCOrders: any[] = [];
    let page = 1;
    const perPage = 100; // Max per_page is 100
    let keepFetching = true;

    while (keepFetching) {
      const response = await api.get("orders", {
        per_page: perPage,
        page: page,
        orderby: 'date',
        order: 'desc',
      });

       if (response.status !== 200) {
        throw new Error(`Failed to fetch orders on page ${page}: ${response.statusText}`);
      }

      const fetchedOrders = response.data;
      allWCOrders = allWCOrders.concat(fetchedOrders);

      if (fetchedOrders.length < perPage) {
        keepFetching = false;
      } else {
        page++;
      }
    }
    
    const orders: Order[] = allWCOrders.map(mapWCOrderToAppOrder);
    return orders;

  } catch (error: any) {
    console.error("Error fetching data from WooCommerce:", error);
     if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo ENOTFOUND')) {
      throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
    }
    if (error.message.includes('Failed to parse URL')) {
        throw new Error(`Invalid WooCommerce store URL. Please check the format in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
    }
    // Re-throw a generic but informative error for other cases.
    throw new Error('Failed to communicate with WooCommerce API. Verify store URL, keys, and network connection.');
  }
};


export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
   if (!api) {
    console.error('WooCommerce API is not configured. Cannot update order status.');
    return false;
  }
   try {
    const response = await api.put(`orders/${orderId}`, {
      status: status
    });

    return response.status === 200;
  } catch (error) {
    console.error(`Failed to update order ${orderId} status in WooCommerce:`, error);
    // You could re-throw a more specific error here to be handled by the server action
    throw new Error('Failed to update order status in WooCommerce.');
  }
};

export const updateOrderAddress = async (orderId: string, payload: UpdateOrderAddressPayload): Promise<boolean> => {
  if (!api) {
    console.error('WooCommerce API is not configured. Cannot update order address.');
    return false;
  }
  try {
    const data: { billing: Partial<UpdateOrderAddressPayload>, meta_data?: any[] } = {
      billing: {}
    };

    // Map all possible fields from the payload to the billing object
    const fields: (keyof UpdateOrderAddressPayload)[] = ['first_name', 'last_name', 'address_1', 'address_2', 'city', 'state', 'postcode', 'country', 'email', 'phone'];
    
    fields.forEach(field => {
      // Allow empty strings to clear a field in WC
      if (payload[field] !== undefined) {
        data.billing[field] = payload[field];
      }
    });
    
    // Handle alternate phone as meta data
    if (payload.alternate_phone !== undefined) {
      data.meta_data = [{
        key: '_billing_alternate_phone',
        value: payload.alternate_phone
      }];
    }


    if (Object.keys(data.billing).length === 0 && !data.meta_data) {
      console.log("No address data to update.");
      return true; // Nothing to update, so we can consider it successful.
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
    // If it's on sale, price is the sale_price. Otherwise, it's the regular_price (or the price field as a fallback).
    price: parseFloat(isSale ? product.sale_price : product.regular_price || product.price || '0'),
    // Only set regularPrice if the item is on sale and the prices are different.
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
  if (!api || !isWooCommerceConfigured()) {
    throw new Error('WooCommerce environment variables are not set correctly.');
  }

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

      if (response.status !== 200) {
        throw new Error(`Failed to fetch products on page ${page}: ${response.statusText}`);
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
    if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo ENOTFOUND')) {
      throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
    }
     if (error.message.includes('Failed to parse URL')) {
        throw new Error(`Invalid WooCommerce store URL. Please check the format in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
    }
    throw new Error('Failed to communicate with WooCommerce API to fetch products.');
  }
};

    