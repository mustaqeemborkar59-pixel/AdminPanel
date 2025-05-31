
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  imageHint?: string; // For AI image generation hint
  availability: boolean;
  description?: string;
  isVegetarian: boolean;
  discount?: number; // Optional discount percentage (e.g., 20 for 20%)
}

export interface OrderItem {
  itemId: string; // Corresponds to MenuItem id
  name: string;
  qty: number;
  price: number; // Price at the time of adding to cart (could be discounted)
  imageUrl?: string; // For display in cart
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | 'pending'; // Added 'pending' for cart
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export interface Order {
  id: string;
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  orderType: OrderType;
  tableNumber?: string; // For dine-in
  deliveryAddress?: string; // For delivery
  totalAmount: number;
  subTotal: number;
  taxAmount: number;
  discountAmount?: number; // Total discount applied to the order
  paymentMethod?: 'cash' | 'card' | 'qr';
  timestamp: string; // ISO string
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // kg, liter, pcs, etc.
  alertLevel: number;
  vendor?: string;
}

export interface StaffMember {
  id:string;
  name: string;
  role: string;
  shift?: string; // e.g., "9 AM - 5 PM"
  status?: 'on-duty' | 'off-duty' | 'on-leave';
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
