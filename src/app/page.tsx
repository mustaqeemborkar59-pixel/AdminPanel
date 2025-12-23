
"use client";

import { useState, useEffect, ReactNode, Suspense, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, ShoppingBag, Activity, UsersRound, Package, ChevronDown, Loader2, Calendar as CalendarIcon, CheckCircle, Clock, PackageSearch, Truck, XCircle, Archive, Loader, ShieldCheck, Store, Crown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import type { Order, StaffMember, OrderStatus, OrderType, MenuItem, Vendor, UserProfile } from '@/types';
import { cn } from '@/lib/utils';
import { getOrdersFromWooCommerce } from '@/app/orders/actions';
import { getVendorsFromFirestore, getAllUsers } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, eachDayOfInterval, startOfTomorrow } from 'date-fns';
import type { DateRange } from "react-day-picker";
import { useAppContext } from '@/components/layout/app-content-wrapper';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
const GRADIENT_COLORS = ["url(#colorSales)", "url(#colorOrders)", "url(#colorCustomers)", "url(#colorProcessing)", "url(#colorCancelled)"];

const statusInfo: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: PackageSearch, color: 'bg-yellow-500', label: 'Pending' },
  queue: { icon: Clock, color: 'bg-blue-500', label: 'In Queue' },
  processing: { icon: Loader, color: 'bg-purple-500', label: 'Processing' },
  dispatch: { icon: Truck, color: 'bg-indigo-500', label: 'Dispatched' },
  completed: { icon: CheckCircle, color: 'bg-green-500', label: 'Completed' },
  hold: { icon: Archive, color: 'bg-orange-500', label: 'On Hold' },
  failed: { icon: XCircle, color: 'bg-red-500', label: 'Failed' },
  cancelled: { icon: XCircle, color: 'bg-red-600', label: 'Cancelled' },
};

// Helper array for gradients for StatsCards
const gradientStyles = [
  "bg-gradient-to-br from-purple-500 to-pink-500",
  "bg-gradient-to-br from-blue-500 to-cyan-400",
  "bg-gradient-to-br from-green-400 to-lime-500",
  "bg-gradient-to-br from-orange-400 to-red-500",
];

function DashboardContent() {
  const { toast } = useToast();
  const { user, userProfile } = useAppContext(); // Get user and profile
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [weeklyOrderData, setWeeklyOrderData] = useState<{name: string, orders: number}[]>([]);
  const [salesDetailsData, setSalesDetailsData] = useState<{name: string, value: number, label: string, icon: React.ElementType, color: string}[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const today = new Date();
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(today.getDate() - 6);
    return { from: sixDaysAgo, to: today };
  });

  const isSuperAdmin = userProfile?.role === 'super-admin';
  const isVendor = userProfile?.role === 'vendor';
  
  const { adminCount, vendorCount, superAdminCount } = useMemo(() => {
    if (!isSuperAdmin) return { adminCount: 0, vendorCount: 0, superAdminCount: 0 };
    return {
      adminCount: allUsers.filter(u => u.role === 'admin').length,
      vendorCount: allUsers.filter(u => u.role === 'vendor').length,
      superAdminCount: allUsers.filter(u => u.role === 'super-admin').length,
    };
  }, [allUsers, isSuperAdmin]);


  const vendorDisplayName = useMemo(() => {
    if (!isVendor || !userProfile?.vendorCode) return 'Shop';
    const vendorDetails = vendors.find(v => v.code === userProfile.vendorCode);
    return vendorDetails?.name || userProfile.vendorCode; // Fallback to code if name not found
  }, [isVendor, userProfile, vendors]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      const promises = [
        getOrdersFromWooCommerce(),
        getVendorsFromFirestore()
      ];

      if (isSuperAdmin) {
        promises.push(getAllUsers());
      }
      
      const [ordersResult, vendorsResult, usersResult] = await Promise.all(promises);

      if (ordersResult.success && ordersResult.data) {
        setOrders(ordersResult.data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load dashboard data",
          description: ordersResult.error || "Could not fetch order data from WooCommerce.",
        });
      }

      if (vendorsResult.success && vendorsResult.data) {
        setVendors(vendorsResult.data);
      } else {
         toast({
          variant: "destructive",
          title: "Failed to load vendor data",
          description: vendorsResult.error || "Could not fetch vendors.",
        });
      }

      if (usersResult && usersResult.success && usersResult.data) {
        setAllUsers(usersResult.data);
      } else if (usersResult && !usersResult.success) {
        toast({
          variant: "destructive",
          title: "Failed to load user data",
          description: usersResult.message || "Could not fetch users.",
        });
      }

      setIsLoading(false);
    };
    fetchDashboardData();
  }, [toast, isSuperAdmin]);
  
  const vendorFilteredOrders = useMemo(() => {
    // If the user is super admin, always return all orders.
    if (isSuperAdmin) {
      return orders;
    }
    // If user is not a vendor (e.g., admin), also return all orders.
    if (!isVendor || !userProfile?.vendorCode) {
      return orders;
    }
    // If the user is a vendor, filter orders and recalculate totals.
    return orders.map(order => {
      const vendorItems = order.items.filter(item => item.vendorName === userProfile.vendorCode);
      if (vendorItems.length === 0) return null;
      
      const subTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const taxRatio = order.subTotal > 0 ? order.taxAmount / order.subTotal : 0;
      const taxAmount = subTotal * taxRatio;
      const totalAmount = subTotal + taxAmount;
      return { ...order, items: vendorItems, subTotal, taxAmount, totalAmount };
    }).filter((order): order is Order => order !== null);
  }, [orders, isVendor, isSuperAdmin, userProfile]);
  

  useEffect(() => {
    if (vendorFilteredOrders.length > 0) {
      // Calculate total sales only from orders with a payment date.
      const validOrdersForRevenue = vendorFilteredOrders.filter(order => order.paymentDate);

      const currentTotalSales = validOrdersForRevenue.reduce((sum, order) => sum + order.totalAmount, 0);
      const currentTotalOrders = vendorFilteredOrders.length;
      
      const uniqueEmails = new Set(vendorFilteredOrders.map(order => order.gmail).filter(Boolean));
      setNewCustomers(uniqueEmails.size);

      setTotalSales(currentTotalSales);
      setTotalOrders(currentTotalOrders);
      
      // --- Chart Data Processing ---
      const fromDate = dateRange?.from ? new Date(dateRange.from) : new Date();
      const toDate = dateRange?.to ? new Date(dateRange.to) : new Date();

      if (!dateRange?.from) fromDate.setDate(new Date().getDate() - 6);

      fromDate.setHours(0,0,0,0);
      toDate.setHours(23,59,59,999);

      const recentPaidOrders = vendorFilteredOrders.filter(order => {
          if (!order.paymentDate) return false;
          const paymentDateInIST = new Date(new Date(order.paymentDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
          return paymentDateInIST >= fromDate && paymentDateInIST <= toDate;
      });
      
      const intervalDays = eachDayOfInterval({ start: fromDate, end: toDate });
      
      const orderCountsByDay = intervalDays.map(day => ({
        name: format(day, 'MMM d'), // Format as 'Jan 1', 'Jan 2' etc.
        date: format(day, 'yyyy-MM-dd'),
        orders: 0
      }));


      recentPaidOrders.forEach(order => {
          if (!order.paymentDate) return;
          const paymentDateInIST = new Date(new Date(order.paymentDate).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
          const paymentDateStr = format(paymentDateInIST, 'yyyy-MM-dd');

          const dayData = orderCountsByDay.find(d => d.date === paymentDateStr);
          if (dayData) {
              dayData.orders += 1;
          }
      });
      
      setWeeklyOrderData(orderCountsByDay);

      // --- Sales Details List Data Processing ---
      const statusCounts: {[key in OrderStatus]?: number} = {};
      vendorFilteredOrders.forEach(order => {
        const statusKey = order.status || 'unknown';
        statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;
      });
      
      const salesData = Object.entries(statusCounts)
        .map(([name, value]) => {
            const statusKey = name as OrderStatus;
            const info = statusInfo[statusKey] || { icon: Activity, color: 'bg-gray-400', label: 'Unknown' };
            return {
                name: statusKey,
                value,
                label: info.label,
                icon: info.icon,
                color: info.color
            };
        })
        .sort((a, b) => b.value - a.value); // Sort for better visualization
      
      setSalesDetailsData(salesData);


    } else {
      setTotalSales(0);
      setTotalOrders(0);
      setNewCustomers(0);
       const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
       setWeeklyOrderData(Array(7).fill(0).map((_, i) => ({ name: daysOfWeek[i], orders: 0 })));
       setSalesDetailsData([]);
    }
  }, [vendorFilteredOrders, dateRange, isVendor]);


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

  const allStatsCards = [
    <StatsCard key="sales" title="Total Sale" value={`₹${totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`} icon={<DollarSign className="h-5 w-5 text-white/70" />} className={cn(gradientStyles[0])} />,
    <StatsCard key="orders" title="Total Orders" value={totalOrders.toString()} icon={<ShoppingBag className="h-5 w-5 text-white/70" />} className={cn(gradientStyles[1])} />,
    <StatsCard key="customers" title="New Customers" value={newCustomers.toLocaleString()} icon={<Users className="h-5 w-5 text-white/70" />} className={cn(gradientStyles[2])} />,
  ];

  if (isSuperAdmin) {
    allStatsCards.push(
      <StatsCard key="admins" title="Admins" value={adminCount.toString()} icon={<ShieldCheck className="h-5 w-5 text-white/70" />} className={cn(gradientStyles[3])} />,
      <StatsCard key="vendors" title="Vendors" value={vendorCount.toString()} icon={<Store className="h-5 w-5 text-white/70" />} className={cn(gradientStyles[1])} />,
      <StatsCard key="super-admins" title="Super Admins" value={superAdminCount.toString()} icon={<Crown className="h-5 w-5 text-white/70" />} className={cn(gradientStyles[0])} />
    );
  }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title={isVendor ? `${vendorDisplayName} Dashboard` : "Shop Dashboard"} description="Comprehensive overview of your online store's operations and performance." />
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allStatsCards}
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-5">
           <Card className="lg:col-span-2">
             <CardHeader>
                <CardTitle className="font-headline text-xl">Sales Details</CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">Breakdown by order status</CardDescription>
            </CardHeader>
             <CardContent className="pt-2">
               {salesDetailsData.length > 0 ? (
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                          <defs>
                              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                              </linearGradient>
                               <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4}/>
                              </linearGradient>
                               <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.4}/>
                              </linearGradient>
                               <linearGradient id="colorProcessing" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4}/>
                              </linearGradient>
                              <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0.4}/>
                              </linearGradient>
                          </defs>
                          <Pie
                              data={salesDetailsData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              innerRadius={50}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                              nameKey="label"
                          >
                              {salesDetailsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
                              ))}
                          </Pie>
                           <Tooltip
                              contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                              itemStyle={{ color: 'hsl(var(--foreground))' }}
                           />
                            <Label
                              value={totalOrders}
                              position="center"
                              fill="hsl(var(--foreground))"
                              className="text-3xl font-bold"
                              dy={-5}
                              />
                              <Label
                              value="Total Orders"
                              position="center"
                              dy={15}
                              fill="hsl(var(--muted-foreground))"
                              className="text-sm"
                              />
                      </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                    {salesDetailsData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center text-sm">
                        <span className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-muted-foreground flex-1">{entry.label}</span>
                        <span className="font-medium text-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  <p>No sales data available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
             <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="font-headline text-xl">Order Activity</CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      size="sm"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal h-8 text-xs",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
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
