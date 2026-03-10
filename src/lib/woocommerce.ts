
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

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
   const api = getWooCommerceApi(); // Get a fresh API instance
   try {
    const response = await api.put(`orders/${orderId}`, {
      status: status
    });

    return response.status === 200;
  } catch (error: any) {
    console.error(`Failed to update order ${orderId} status in WooCommerce:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update order status in WooCommerce.');
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
  } catch (error: any) {
    console.error(`Failed to update order ${orderId} address in WooCommerce:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update order address in WooCommerce.');
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
