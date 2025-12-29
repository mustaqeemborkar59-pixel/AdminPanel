

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  regularPrice?: number;
  imageUrl?: string;
  imageHint?: string;
  availability: boolean;
  description?: string;
}

export interface OrderItem {
  itemId: string; // Corresponds to MenuItem id (now Product id)
  name: string;
  sku?: string;
  qty: number;
  price: number; // Price at the time of adding to cart (could be discounted)
  imageUrl?: string; // For display in cart;
  imageHint?: string;
  vendorName?: string;
}

export type OrderStatus = 'pending' | 'failed' | 'cancelled' | 'queue' | 'processing' | 'completed' | 'hold' | 'dispatch';
export type OrderType = 'delivery' | 'takeaway' | 'dine-in';

export interface Order {
  id: string;
  customerName?: string;
  phone?: string;
  altPhone?: string;
  pincode?: string;
  gmail?: string;
  items: OrderItem[];
  status: OrderStatus;
  orderType: OrderType;
  billingAddress?: string;
  billing_city?: string;
  billing_state?: string;
  billing_country?: string;
  shippingAddress?: string; // For delivery
  trackingId?: string; // For shipped orders
  totalAmount: number;
  subTotal: number;
  taxAmount: number;
  timestamp: string; // ISO string
  paymentMethod?: 'cash' | 'card' | 'qr';
  tableNumber?: string;
  paymentDate?: string | null;
  vendorName?: string;
}

export interface UpdateOrderAddressPayload {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  email?: string;
  phone?: string;
  alternate_phone?: string;
}


export interface StaffMember {
  id:string;
  name: string;
  role: string;
  shift?: string; // e.g., "9 AM - 5 PM"
  status?: 'on-duty' | 'off-duty' | 'on-leave';
  lastSeen?: string; // e.g., "Online" or "2 hours ago"
  timeSpent?: string; // e.g., "8h 15m"
}

export interface DailySpecialSuggestion {
  name: string;
  reasoning: string;
  ingredients: string[];
}

export interface TableReservation {
  id: string;
  customerName: string;
  phone: string;
  tableNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
}

// Represents a user profile stored in the database.
export interface UserProfile {
  uid: string;
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  role: 'admin' | 'vendor' | 'user' | 'super-admin'; // Role is now mandatory
  status: 'active' | 'blocked'; // Add status field
  vendorCode?: string | null; // Associated vendor code
  subscriptionStartDate?: string; // ISO string for when subscription/trial starts
  trialUsed?: boolean; // To track if the user has used their trial
  activePlanId?: string; // To track the current active plan ID
}

export interface Vendor {
    id: string;
    code: string;
    name: string;
    profitMargin: number;
}

// This interface is used by the jspdf-autotable library.
// We declare it here to satisfy TypeScript.
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
        finalY: number;
    };
  }
}

export interface CompanyDetails {
  companyName: string;
  address: string;
  city: string;
  email: string;
}


export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  regularPrice?: string;
  pricePeriod: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  variant: 'outline' | 'default';
  isCurrent?: boolean;
  trialDays?: number;
}
