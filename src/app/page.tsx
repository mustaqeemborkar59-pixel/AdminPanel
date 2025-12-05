
"use client";

import { useState, useEffect, ReactNode, Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, ShoppingBag, Archive, Activity, AlertTriangle, UsersRound, Package, ChevronDown, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label, LabelList } from 'recharts';
import type { Order, InventoryItem, StaffMember, OrderStatus, OrderType, MenuItem } from '@/types';
import { initialMenuItems } from '@/lib/menu-item-data';
import { cn } from '@/lib/utils';
import { getOrdersFromWooCommerce } from '@/app/orders/actions';
import { useToast } from '@/hooks/use-toast';

// --- Initial Data (adapted for e-commerce) ---
const initialInventoryItemsData: InventoryItem[] = [
  { id: 'INV001', name: 'Laptop Pro', quantity: 50, unit: 'pcs', alertLevel: 10, vendor: 'Tech Supply Co.' },
  { id: 'INV002', name: 'Wireless Mouse', quantity: 100, unit: 'pcs', alertLevel: 20, vendor: 'Gadget Imports' },
  { id: 'INV003', name: 'USB-C Hub', quantity: 20, unit: 'pcs', alertLevel: 5, vendor: 'Accessories Ltd.' },
  { id: 'INV004', name: 'Keyboard', quantity: 3, unit: 'pcs', alertLevel: 10, vendor: 'Local Electronics' },
  { id: 'INV005', name: 'Webcam', quantity: 15, unit: 'pcs', alertLevel: 5, vendor: 'Vision Best' },
  { id: 'INV006', name: 'Monitor', quantity: 2, unit: 'pcs', alertLevel: 5, vendor: 'Displays Inc.' },
];

const initialStaffData: StaffMember[] = [
    { id: 'STAFF001', name: 'John Doe', role: 'Fulfillment', shift: '9 AM - 5 PM', status: 'on-duty' },
    { id: 'STAFF002', name: 'Jane Smith', role: 'Support', shift: '12 PM - 8 PM', status: 'on-duty' },
    { id: 'STAFF003', name: 'Mike Brown', role: 'Marketing', shift: '10 AM - 6 PM', status: 'off-duty' },
];
// --- End Initial Data ---

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const STATUS_COLORS: Record<string, string> = {
  pending: '#FBBF24', // yellow-400
  queue: '#A78BFA',   // violet-400 (purple)
  processing: '#60A5FA', // blue-400
  dispatch: '#3B82F6',   // blue-600
  completed: '#34D399', // emerald-400 (green)
  hold: '#F97316',      // orange-500
  failed: '#EF4444',    // red-500
  cancelled: '#DC2626', // red-600
};

// Helper array for gradients for StatsCards
const gradientStyles = [
  "bg-gradient-to-br from-purple-500 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-cyan-400",
  "bg-gradient-to-br from-orange-400 to-red-500",
  "bg-gradient-to-br from-green-400 to-lime-500",
];

function DashboardContent() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeStaffCount, setActiveStaffCount] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [weeklyOrderData, setWeeklyOrderData] = useState<{name: string, orders: number}[]>([]);
  const [salesDetailsData, setSalesDetailsData] = useState<{name: string, value: number}[]>([]);


  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const result = await getOrdersFromWooCommerce();
      if (result.success && result.data) {
        setOrders(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load dashboard data",
          description: result.error || "Could not fetch order data from WooCommerce.",
        });
      }
      setIsLoading(false);
    };
    fetchOrders();
  }, [toast]);
  
  useEffect(() => {
    if (orders.length > 0) {
      const validOrdersForRevenue = orders.filter(order => 
        !['pending', 'failed', 'cancelled'].includes(order.status)
      );

      const currentTotalSales = validOrdersForRevenue.reduce((sum, order) => sum + order.totalAmount, 0);
      const currentTotalOrders = orders.length;
      
      const uniqueEmails = new Set(orders.map(order => order.gmail).filter(Boolean));
      setNewCustomers(uniqueEmails.size);

      setTotalSales(currentTotalSales);
      setTotalOrders(currentTotalOrders);
      
      // --- Chart Data Processing ---
      const nowInIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      nowInIST.setHours(23, 59, 59, 999); 

      const sixDaysAgoIST = new Date(nowInIST);
      sixDaysAgoIST.setDate(nowInIST.getDate() - 6);
      sixDaysAgoIST.setHours(0, 0, 0, 0); 

      const recentOrders = orders.filter(order => {
          if (!order.paymentDate) {
            return false;
          }
          const orderDate = new Date(order.timestamp);
          return orderDate >= sixDaysAgoIST && orderDate <= nowInIST;
      });
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const orderCountsByDay = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(nowInIST);
          date.setDate(nowInIST.getDate() - i);
          
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');

          return {
              name: days[date.getDay()],
              date: `${year}-${month}-${day}`, // YYYY-MM-DD
              orders: 0
          };
      }).reverse();

      recentOrders.forEach(order => {
          const orderDate = new Date(order.timestamp);
          const orderDateInIST = new Date(orderDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
          
          const year = orderDateInIST.getFullYear();
          const month = String(orderDateInIST.getMonth() + 1).padStart(2, '0');
          const day = String(orderDateInIST.getDate()).padStart(2, '0');
          const orderDateStr = `${year}-${month}-${day}`;

          const dayData = orderCountsByDay.find(d => d.date === orderDateStr);
          if (dayData) {
              dayData.orders += 1;
          }
      });
      
      setWeeklyOrderData(orderCountsByDay);

      // --- Sales Details Chart Data Processing ---
      const statusCounts: {[key in OrderStatus]?: number} = {};
      orders.forEach(order => {
        const statusKey = order.status || 'unknown';
        statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
      });
      
      const salesData = Object.entries(statusCounts)
        .map(([name, value]) => ({ 
          name: name.charAt(0).toUpperCase() + name.slice(1), 
          value 
        }))
        .sort((a,b) => b.value - a.value); // Sort for better visualization
      
      setSalesDetailsData(salesData);


    } else {
      setTotalSales(0);
      setTotalOrders(0);
      setNewCustomers(0);
       const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
       setWeeklyOrderData(Array(7).fill(0).map((_, i) => ({ name: daysOfWeek[i], orders: 0 })));
       setSalesDetailsData([]);
    }

    // Static data remains for now
    setActiveStaffCount(initialStaffData.filter(staff => staff.status === 'on-duty').length);
  }, [orders]);


  if (isLoading) {
    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Shop Dashboard" description="Comprehensive overview of your online store's operations and performance." />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Shop Dashboard" description="Comprehensive overview of your online store's operations and performance." />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Revenue" value={`₹${totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`} icon={<DollarSign className="h-5 w-5 text-white/70" />} className={gradientStyles[0]} />
          <StatsCard title="Total Orders" value={totalOrders.toString()} icon={<ShoppingBag className="h-5 w-5 text-white/70" />} className={gradientStyles[1]} />
          <StatsCard title="Active Staff" value={activeStaffCount.toString()} icon={<UsersRound className="h-5 w-5 text-white/70" />} className={gradientStyles[1]} />
           <StatsCard title="New Customers" value={newCustomers.toLocaleString()} icon={<Users className="h-5 w-5 text-white/70" />} className={gradientStyles[3]} />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline text-xl">Sales Details</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">Breakdown by order status</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={salesDetailsData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" horizontal={false}/>
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                        <YAxis 
                          type="category" 
                          dataKey="name"
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12} 
                          axisLine={false} 
                          tickLine={false}
                          width={80}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                            labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                            cursor={{fill: 'hsl(var(--muted)/0.3)'}}
                        />
                        <Bar dataKey="value" name="Orders" barSize={20} radius={[0, 4, 4, 0]}>
                           {salesDetailsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
             <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="font-headline text-xl">Weekly Order Chart</CardTitle>
               <Button variant="outline" size="sm" className="ml-auto h-8 text-xs">
                Last 7 Days
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyOrderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" vertical={false} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{fill: 'hsl(var(--muted)/0.3)'}}
                  />
                  <Bar dataKey="orders" name="Orders" radius={[4, 4, 0, 0]}>
                     {weeklyOrderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

    