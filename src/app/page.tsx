
"use client";

import { useState, useEffect, ReactNode, Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, ShoppingBag, Archive, Activity, AlertTriangle, UsersRound, Utensils, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label, LabelList } from 'recharts';
import type { Order, InventoryItem, StaffMember, OrderStatus, OrderType, MenuItem } from '@/types';
import { initialMenuItems } from '@/lib/menu-item-data';
import { cn } from '@/lib/utils';


// --- Initial Data (copied from other pages for demonstration) ---
const initialOrdersData: Order[] = [
  { id: 'ORD001', customerName: 'Alice Smith', items: [{ itemId: '1', name: 'Margherita Pizza', qty: 1, price: 12.99, imageUrl: 'https://placehold.co/100x100.png' }], status: 'preparing', orderType: 'dine-in', tableNumber: '5', totalAmount: 12.99, subTotal: 12.99, taxAmount: 0, timestamp: new Date().toISOString() },
  { id: 'ORD002', customerName: 'Bob Johnson', items: [{ itemId: '2', name: 'Spaghetti Carbonara', qty: 2, price: 15.50, imageUrl: 'https://placehold.co/100x100.png' }], status: 'placed', orderType: 'takeaway', totalAmount: 31.00, subTotal: 31.00, taxAmount: 0, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'ORD003', customerName: 'Carol Williams', items: [{ itemId: '3', name: 'Caesar Salad', qty: 1, price: 9.75, imageUrl: 'https://placehold.co/100x100.png' }, { itemId: '4', name: 'Tiramisu', qty: 1, price: 7.00, imageUrl: 'https://placehold.co/100x100.png' }], status: 'delivered', orderType: 'delivery', totalAmount: 16.75, subTotal: 16.75, taxAmount: 0, timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
  { id: 'ORD004', customerName: 'David Brown', items: [{ itemId: '1', name: 'Margherita Pizza', qty: 1, price: 12.99, imageUrl: 'https://placehold.co/100x100.png' }, { itemId: '5', name: 'Bruschetta', qty: 1, price: 8.50, imageUrl: 'https://placehold.co/100x100.png' }], status: 'ready', orderType: 'dine-in', tableNumber: '2', totalAmount: 21.49, subTotal: 21.49, taxAmount: 0, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 'ORD005', customerName: 'Eva Green', items: [{ itemId: '2', name: 'Spaghetti Carbonara', qty: 1, price: 15.50, imageUrl: 'https://placehold.co/100x100.png' }], status: 'placed', orderType: 'takeaway', totalAmount: 15.50, subTotal: 15.50, taxAmount: 0, timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
];


const initialInventoryItemsData: InventoryItem[] = [
  { id: 'INV001', name: 'Tomatoes', quantity: 50, unit: 'kg', alertLevel: 10, vendor: 'Fresh Farms Co.' },
  { id: 'INV002', name: 'Pasta', quantity: 100, unit: 'kg', alertLevel: 20, vendor: 'Italian Imports' },
  { id: 'INV003', name: 'Olive Oil', quantity: 20, unit: 'liters', alertLevel: 5, vendor: 'Organic Oils Ltd.' },
  { id: 'INV004', name: 'Chicken Breast', quantity: 3, unit: 'kg', alertLevel: 10, vendor: 'Local Butchers' },
  { id: 'INV005', name: 'Mozzarella Cheese', quantity: 15, unit: 'kg', alertLevel: 5, vendor: 'Dairy Best' },
  { id: 'INV006', name: 'Flour', quantity: 2, unit: 'kg', alertLevel: 5, vendor: 'Bulk Goods Inc.' },
];

const initialStaffData: StaffMember[] = [
  { id: 'STAFF001', name: 'John Doe', role: 'Chef', shift: '9 AM - 5 PM', status: 'on-duty' },
  { id: 'STAFF002', name: 'Jane Smith', role: 'Waiter', shift: '12 PM - 8 PM', status: 'on-duty' },
  { id: 'STAFF003', name: 'Mike Brown', role: 'Delivery Driver', shift: '10 AM - 6 PM', status: 'off-duty' },
  { id: 'STAFF004', name: 'Emily White', role: 'Manager', shift: '8 AM - 4 PM', status: 'on-leave' },
  { id: 'STAFF005', name: 'Chris Green', role: 'Waiter', shift: '5 PM - 1 AM', status: 'on-duty' },
];
// --- End Initial Data ---


const weeklyOrderData = [
  { name: 'Sat', sales: 180 },
  { name: 'Sun', sales: 240 },
  { name: 'Mon', sales: 220 },
  { name: 'Tue', sales: 265 }, // Highlighted
  { name: 'Wed', sales: 200 },
  { name: 'Thu', sales: 150 },
  { name: 'Fri', sales: 120 },
];

const salesDetailsData = [
  { name: 'Total Order', value: 35 },
  { name: 'Running order', value: 22 },
  { name: 'Customer Growth', value: 26 },
  { name: 'Total Revenue', value: 17 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

// Helper array for gradients for StatsCards
const gradientStyles = [
  "bg-gradient-to-br from-purple-500 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-cyan-400",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-green-400 to-lime-500",
];

const renderCustomLegend = (props: any) => {
  const { payload } = props;
  if (!payload || !payload.length) {
    return null;
  }
  return (
    <ul className="flex flex-col space-y-3 text-sm ml-2 md:ml-6">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center">
          <span style={{ backgroundColor: entry.color, width: '10px', height: '10px', borderRadius: '2px', marginRight: '10px', display: 'inline-block' }}></span>
          <span className="text-muted-foreground mr-1">{entry.payload.name}:</span>
          <span className="font-semibold text-foreground">{entry.payload.value}%</span>
        </li>
      ))}
    </ul>
  );
};


function DashboardContent() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [inventoryItemCount, setInventoryItemCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [activeStaffCount, setActiveStaffCount] = useState(0);
  const newCustomers = 45; // Placeholder data

  useEffect(() => {
    const currentTotalSales = initialOrdersData.reduce((sum, order) => sum + order.totalAmount, 0);
    const currentTotalOrders = initialOrdersData.length;
    setTotalSales(currentTotalSales);
    setTotalOrders(currentTotalOrders);
    setAverageOrderValue(currentTotalOrders > 0 ? currentTotalSales / currentTotalOrders : 0);

    setInventoryItemCount(initialInventoryItemsData.length);
    setLowStockCount(initialInventoryItemsData.filter(item => item.quantity <= item.alertLevel).length);
    setMenuItemCount(initialMenuItems.length);
    setActiveStaffCount(initialStaffData.filter(staff => staff.status === 'on-duty').length);
  }, []);


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Restaurant Dashboard" description="Comprehensive overview of your restaurant's operations and performance." />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Sales" value={`$${totalSales.toFixed(2)}`} icon={<DollarSign className="h-5 w-5 text-white/70" />} className={gradientStyles[0]} />
          <StatsCard title="Total Orders" value={totalOrders.toString()} icon={<ShoppingBag className="h-5 w-5 text-white/70" />} className={gradientStyles[1]} />
          <StatsCard title="Avg. Order Value" value={`$${averageOrderValue.toFixed(2)}`} icon={<Activity className="h-5 w-5 text-white/70" />} className={gradientStyles[2]} />
          <StatsCard title="Menu Items" value={menuItemCount.toString()} icon={<Utensils className="h-5 w-5 text-white/70" />} className={gradientStyles[3]} />
          <StatsCard title="Total Inventory" value={inventoryItemCount.toString()} icon={<Archive className="h-5 w-5 text-white/70" />} className={gradientStyles[0]} />
          <StatsCard 
            title="Low Stock Alerts" 
            value={lowStockCount.toString()} 
            icon={<AlertTriangle className="h-5 w-5 text-white" />} 
            badgeText={lowStockCount > 0 ? `${lowStockCount} items` : undefined} 
            badgeVariant={lowStockCount > 0 ? "destructive" : undefined} 
            className={gradientStyles[2]}
          />
          <StatsCard title="Active Staff" value={activeStaffCount.toString()} icon={<UsersRound className="h-5 w-5 text-white/70" />} className={gradientStyles[1]} />
           <StatsCard title="New Customers" value={newCustomers.toString()} icon={<Users className="h-5 w-5 text-white/70" />} className={gradientStyles[3]} />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl">Sales Details</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">February, 2023</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="ml-auto h-8 text-xs">
                Monthly <ChevronDown className="ml-2 h-3 w-3 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center pt-4">
              <ResponsiveContainer width="50%" height={250} className="min-w-[150px] md:min-w-[200px]">
                <PieChart>
                  <Pie
                    data={salesDetailsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={85}
                    innerRadius={55} 
                    fill="#8884d8"
                    dataKey="value"
                    strokeWidth={2}
                    stroke="hsl(var(--background))" 
                  >
                    {salesDetailsData.map((entry, index) => (
                      <Cell key={`cell-sales-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                     <Label
                        value="100%"
                        position="center"
                        className="fill-foreground text-2xl font-bold"
                        dy={-5}
                      />
                  </Pie>
                  <Tooltip
                     contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                     labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                     itemStyle={{ color: 'hsl(var(--foreground))' }}
                     formatter={(value, name) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full mt-4 md:mt-0 md:w-1/2">
                <Legend content={renderCustomLegend} verticalAlign="middle" align="right" layout="vertical" />
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">Order Chart</CardTitle>
               <Button variant="outline" size="sm" className="ml-auto h-8 text-xs">
                Weekly <ChevronDown className="ml-2 h-3 w-3 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyOrderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{fill: 'hsl(var(--muted)/0.3)'}}
                  />
                  <Bar dataKey="sales" name="Orders" radius={[4, 4, 0, 0]}>
                    {weeklyOrderData.map((entry, index) => (
                        <Cell key={`cell-order-${index}`} fill={entry.name === 'Tue' ? 'hsl(var(--chart-5))' : 'hsl(var(--primary)/0.6)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage()
 {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}


interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | null | undefined;
  className?: string; 
}

function StatsCard({ title, value, icon, badgeText, badgeVariant, className }: StatsCardProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 text-white", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {badgeText && <p className={`text-xs ${badgeVariant === 'destructive' ? 'text-white font-semibold' : 'text-white/80'} pt-1`}>{badgeText}</p>}
      </CardContent>
    </Card>
  );
}

    
