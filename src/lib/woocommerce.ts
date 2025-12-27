

import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Order, OrderItem, OrderStatus, type UpdateOrderAddressPayload, type MenuItem } from '@/types';

// This function will be called every time we need the API instance.
// This makes it robust against server hot-reloads where process.env might not be available initially.
const getWooCommerceApi = (): WooCommerceRestApi => {
  const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;
  const consumerKey = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET;

  if (!storeUrl || storeUrl === 'https://your-store-url.com' || !consumerKey || !consumerSecret) {
    throw new Error('WooCommerce environment variables are not set correctly. Please check your .env file.');
  }

  try {
    // Validate URL format before creating the instance
    new URL(storeUrl);
    return new WooCommerceRestApi({
      url: storeUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: "wc/v3",
      timeout: 60000,
    });
  } catch (error) {
    console.error("Failed to initialize WooCommerce API. Please check the store URL in your .env file.", error);
    if (error instanceof TypeError) { // Catches invalid URL error
      throw new Error(`Invalid WooCommerce store URL format: ${storeUrl}`);
    }
    throw error; // Re-throw other errors
  }
};


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
    if (item.sku && typeof item.sku === 'string') {
        const hyphenIndex = item.sku.indexOf('-');
        if (hyphenIndex > 0) {
            // Extract the part before the first hyphen as the vendor code
            itemVendorName = item.sku.substring(0, hyphenIndex);
        } else {
            // Fallback for SKUs without a hyphen (or other formats if needed)
            itemVendorName = item.sku;
        }

        if (itemVendorName && !primaryVendorName) {
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

  const altPhoneMeta = wcOrder.meta_data.find((m: any) => m.key === '_billing_alternate_phone');
  const altPhone = altPhoneMeta ? altPhoneMeta.value : undefined;

  // Ensure timestamp is a valid ISO string, providing a fallback.
  const timestamp = wcOrder.date_created_gmt ? wcOrder.date_created_gmt + 'Z' : new Date(0).toISOString();

  return {
    id: String(wcOrder.id),
    customerName: `${wcOrder.billing.first_name} ${wcOrder.billing.last_name}`,
    phone: wcOrder.billing.phone,
    altPhone: altPhone,
    pincode: wcOrder.billing.postcode,
    gmail: wcOrder.billing.email,
    items: items,
    status: wcOrder.status as OrderStatus,
    orderType: 'delivery',
    billingAddress: billingAddress,
    billing_city: wcOrder.billing.city,
    billing_state: wcOrder.billing.state,
    billing_country: wcOrder.billing.country,
    shippingAddress: shippingAddress,
    trackingId: wcOrder.meta_data.find((m: any) => m.key === '_wc_shipment_tracking_items')?.value[0]?.tracking_number || '',
    totalAmount: parseFloat(wcOrder.total || '0'),
    subTotal: subTotal,
    taxAmount: parseFloat(wcOrder.total_tax || '0'),
    timestamp: timestamp,
    paymentMethod: wcOrder.payment_method_title,
    paymentDate: wcOrder.date_paid_gmt ? wcOrder.date_paid_gmt + 'Z' : null,
    vendorName: primaryVendorName
  };
};

export const getOrders = async (): Promise<Order[]> => {
  const api = getWooCommerceApi(); // Get a fresh API instance
  
  try {
    let allWCOrders: any[] = [];
    let page = 1;
    const perPage = 100;
    let keepFetching = true;

    while (keepFetching) {
      const response = await api.get("orders", {
        per_page: perPage,
        page: page,
        orderby: 'date',
        order: 'desc',
      });

      // Correctly check for response status. The status is on the request's response object.
       if (response?.request?.res?.statusCode !== 200) {
        const status = response?.request?.res?.statusCode;
        const statusText = response?.request?.res?.statusMessage;
        throw new Error(`Failed to fetch orders on page ${page}. Status: ${status} ${statusText}`);
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
     if (error.code === 'ENOTFOUND' || (error.message && error.message.includes('getaddrinfo ENOTFOUND'))) {
      throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file.`);
    }
    // Re-throw a generic but informative error for other cases.
    throw new Error('Failed to communicate with WooCommerce API. Verify store URL, keys, and network connection.');
  }
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
    const data: { billing: Partial<UpdateOrderAddressPayload>, meta_data?: any[] } = {
      billing: {}
    };

    const fields: (keyof UpdateOrderAddressPayload)[] = ['first_name', 'last_name', 'address_1', 'address_2', 'city', 'state', 'postcode', 'country', 'email', 'phone'];
    
    fields.forEach(field => {
      if (payload[field] !== undefined) {
        data.billing[field] = payload[field];
      }
    });
    
    if (payload.alternate_phone !== undefined) {
      data.meta_data = [{
        key: '_billing_alternate_phone',
        value: payload.alternate_phone
      }];
    }

    if (Object.keys(data.billing).length === 0 && !data.meta_data) {
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
