
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Utensils, // For Menu
  ClipboardList,
  Archive,
  Sparkles,
  UsersRound,
  Settings,
  PanelLeft,
  Table, // For Table Services
  CalendarCheck, // For Reservation
  Truck, // For Delivery
  LineChart, // For Accounting
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/menu', label: 'Menu', icon: Utensils },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  // { href: '/tables', label: 'Table Services', icon: Table },
  // { href: '/reservations', label: 'Reservation', icon: CalendarCheck },
  // { href: '/delivery', label: 'Delivery', icon: Truck },
  { href: '/inventory', label: 'Inventory', icon: Archive },
  { href: '/specials', label: 'Specials', icon: Sparkles },
  // { href: '/accounting', label: 'Accounting', icon: LineChart },
  { href: '/staff', label: 'Staff', icon: UsersRound },
  // { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebarNav() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile } = useSidebar();

  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center justify-between", open ? "" : "justify-center")}>
          {open && <Logo />}
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                <PanelLeft />
             </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1"> {/* flex-1 to push footer down */}
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={{ children: item.label, className: "font-body" }}
                    className={cn(
                      "font-medium text-sm",
                      isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-sidebar-foreground/80 group-hover/menu-button:text-sidebar-accent-foreground")} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
        {open && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png?text=FM" alt="Floyd Miles" />
                <AvatarFallback>FM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">Floyd Miles</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
             <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive">
              <UsersRound className="mr-2 h-4 w-4" /> Logout {/* Using UsersRound as placeholder for Logout */}
            </Button>
          </div>
        )}
         {!open && (
          <div className="space-y-2">
             <Tooltip>
                <TooltipTrigger asChild>
                     <Avatar className="h-9 w-9 mx-auto">
                        <AvatarImage src="https://placehold.co/40x40.png?text=FM" alt="Floyd Miles" />
                        <AvatarFallback>FM</AvatarFallback>
                    </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-body">Floyd Miles</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><Settings /></Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-body">Settings</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"><UsersRound /></Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-body">Logout</TooltipContent>
            </Tooltip>
          </div>
        )}
      </SidebarFooter>
    </>
  );
}
