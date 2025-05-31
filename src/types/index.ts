
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  imageHint?: string;
  availability: boolean;
  description?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  qty: number;
  price: number;
}

export type OrderStatus = 'placed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export interface Order {
  id: string;
  customerName?: string;
  items: OrderItem[];
  status: OrderStatus;
  orderType: OrderType;
  tableNumber?: string;
  totalAmount: number;
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
