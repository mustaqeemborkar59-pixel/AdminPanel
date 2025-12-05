
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { Order, OrderItem, OrderStatus } from '@/types';

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
  api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL!,
    consumerKey: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY!,
    consumerSecret: process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET!,
    version: "wc/v3"
  });
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

  const items: OrderItem[] = wcOrder.line_items.map((item: any) => {
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

  return {
    id: String(wcOrder.id),
    customerName: `${wcOrder.billing.first_name} ${wcOrder.billing.last_name}`,
    phone: wcOrder.billing.phone,
    altPhone: '', // Not available in standard WC orders
    pincode: wcOrder.billing.postcode,
    gmail: wcOrder.billing.email,
    items: items,
    status: wcOrder.status as OrderStatus,
    orderType: 'delivery', // Defaulting to delivery
    billingAddress: billingAddress,
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
  if (!api) {
    // Throw an error that will be caught by the server action and displayed to the user.
    throw new Error('WooCommerce environment variables are not set correctly. Please check your .env file and ensure NEXT_PUBLIC_WOOCOMMERCE_STORE_URL is set to your store\'s URL.');
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

  } catch (error) {
    console.error("Error fetching data from WooCommerce:", error);
    if (error instanceof Error && (error.message.includes('getaddrinfo ENOTFOUND') || error.message.includes('Failed to parse URL'))) {
      throw new Error('Could not connect to WooCommerce store. Please check the store URL in your .env file.');
    }
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
    return false;
  }
};

    