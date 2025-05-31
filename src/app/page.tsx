
"use client";

import { useState, useEffect, ReactNode, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, ShoppingBag, Archive, Activity, AlertTriangle, UsersRound, Utensils } from 'lucide-react'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { Order, InventoryItem, StaffMember, OrderStatus, OrderType, MenuItem } from '@/types';
import { initialMenuItems } from '@/lib/menu-item-data';
import { useToast } from '@/hooks/use-toast';


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


const dailySalesData = [ 
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const topSellingItemsData = [ 
  { name: 'Pizza Margherita', value: 400 },
  { name: 'Pasta Carbonara', value: 300 },
  { name: 'Caesar Salad', value: 200 },
  { name: 'Tiramisu', value: 150 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const PIE_COLORS_EXTENDED = [COLORS[0], COLORS[1], COLORS[2], COLORS[3], 'hsl(var(--primary))', 'hsl(var(--secondary))'];


interface ChartDataPoint {
  name: string;
  value: number;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [inventoryItemCount, setInventoryItemCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [menuItemCount, setMenuItemCount] = useState(0);
  const [activeStaffCount, setActiveStaffCount] = useState(0);

  const [orderStatusData, setOrderStatusData] = useState<ChartDataPoint[]>([]);
  const [orderTypeData, setOrderTypeData] = useState<ChartDataPoint[]>([]);
  const [staffStatusData, setStaffStatusData] = useState<ChartDataPoint[]>([]);
  
  const newCustomers = 45; // Placeholder data

  useEffect(() => {
    const loginSuccess = searchParams.get('login_success');
    const signupSuccess = searchParams.get('signup_success');

    if (loginSuccess === 'true') {
      toast({
        title: "Login Successful",
        description: "Welcome back to your dashboard!",
      });
      router.replace('/', { scroll: false }); // Remove query param
    }
    if (signupSuccess === 'true') {
      toast({
        title: "Signup Successful",
        description: "Welcome to GastroFlow! Your account has been created.",
      });
      router.replace('/', { scroll: false }); // Remove query param
    }
  }, [searchParams, router, toast]);

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

    const statusCounts: Record<OrderStatus, number> = { placed: 0, preparing: 0, ready: 0, delivered: 0, cancelled: 0, pending: 0 };
    initialOrdersData.forEach(order => { statusCounts[order.status]++; });
    setOrderStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })).filter(d => d.value > 0));

    const typeCounts: Record<OrderType, number> = { 'dine-in': 0, takeaway: 0, delivery: 0 };
    initialOrdersData.forEach(order => { typeCounts[order.orderType]++; });
    setOrderTypeData(Object.entries(typeCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })).filter(d => d.value > 0));
    
    const staffStatusCounts: Record<string, number> = { 'On-duty': 0, 'Off-duty': 0, 'On-leave': 0 };
    initialStaffData.forEach(staff => {
      if (staff.status) {
        const key = staff.status.charAt(0).toUpperCase() + staff.status.slice(1).replace('-', ' ');
        staffStatusCounts[key] = (staffStatusCounts[key] || 0) + 1;
      }
    });
    setStaffStatusData(Object.entries(staffStatusCounts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0));

  }, []);


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Restaurant Dashboard" description="Comprehensive overview of your restaurant's operations and performance." />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Sales" value={`$${totalSales.toFixed(2)}`} icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} />
          <StatsCard title="Total Orders" value={totalOrders.toString()} icon={<ShoppingBag className="h-5 w-5 text-muted-foreground" />} />
          <StatsCard title="Avg. Order Value" value={`$${averageOrderValue.toFixed(2)}`} icon={<Activity className="h-5 w-5 text-muted-foreground" />} />
          <StatsCard title="Menu Items" value={menuItemCount.toString()} icon={<Utensils className="h-5 w-5 text-muted-foreground" />} />
          <StatsCard title="Total Inventory" value={inventoryItemCount.toString()} icon={<Archive className="h-5 w-5 text-muted-foreground" />} />
          <StatsCard title="Low Stock Alerts" value={lowStockCount.toString()} icon={<AlertTriangle className="h-5 w-5 text-destructive" />} badgeText={lowStockCount > 0 ? `${lowStockCount} items` : undefined} badgeVariant={lowStockCount > 0 ? "destructive" : undefined} />
          <StatsCard title="Active Staff" value={activeStaffCount.toString()} icon={<UsersRound className="h-5 w-5 text-muted-foreground" />} />
           <StatsCard title="New Customers" value={newCustomers.toString()} icon={<Users className="h-5 w-5 text-muted-foreground" />} />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Daily Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }} />
                  <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Sales ($)"/>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Top Selling Items (Example)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topSellingItemsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    stroke="hsl(var(--border))"
                  >
                    {topSellingItemsData.map((entry, index) => (
                      <Cell key={`cell-top-selling-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                     contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                     labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                     itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            <Card>
                <CardHeader><CardTitle className="font-headline">Order Status</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={orderStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {orderStatusData.map((entry, index) => <Cell key={`cell-order-status-${index}`} fill={PIE_COLORS_EXTENDED[index % PIE_COLORS_EXTENDED.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '0.875rem' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="font-headline">Order Types</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={orderTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {orderTypeData.map((entry, index) => <Cell key={`cell-order-type-${index}`} fill={PIE_COLORS_EXTENDED[index % PIE_COLORS_EXTENDED.length]} />)}
                            </Pie>
                             <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '0.875rem' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="font-headline">Staff Availability</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={staffStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {staffStatusData.map((entry, index) => <Cell key={`cell-staff-status-${index}`} fill={PIE_COLORS_EXTENDED[index % PIE_COLORS_EXTENDED.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: '0.875rem' }}/>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Wrap DashboardContent with Suspense because useSearchParams() needs it.
  return (
    <Suspense fallback={<div>Loading...</div>}> 
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
}

function StatsCard({ title, value, icon, badgeText, badgeVariant }: StatsCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {badgeText && <p className={`text-xs ${badgeVariant === 'destructive' ? 'text-destructive' : 'text-muted-foreground'} pt-1`}>{badgeText}</p>}
      </CardContent>
    </Card>
  );
}

