
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  Archive,
  Sparkles,
  UsersRound,
  Settings,
  PanelLeft,
  SquareStack,
  CalendarCheck,
  Truck,
  LogOut,
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
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';
import type { User } from 'firebase/auth'; 
import { auth } from '@/lib/firebase'; // Import auth for client-side sign out
import { useToast } from '@/hooks/use-toast'; // For potential error messages

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/menu', label: 'Menu', icon: Utensils },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/tables', label: 'Table Services', icon: SquareStack },
  { href: '/reservations', label: 'Reservation', icon: CalendarCheck },
  { href: '/delivery', label: 'Delivery', icon: Truck },
  { href: '/inventory', label: 'Inventory', icon: Archive },
  { href: '/specials', label: 'Specials', icon: Sparkles },
  { href: '/staff', label: 'Staff', icon: UsersRound },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface AppSidebarNavProps {
  user: User | null;
  authLoading: boolean;
}

export function AppSidebarNav({ user, authLoading }: AppSidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { open, toggleSidebar, isMobile, state, openMobile, setOpenMobile } = useSidebar();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // onAuthStateChanged in AppContentWrapper will handle redirect logic
      // but we can push to login page immediately for a faster UX
      router.push('/login'); 
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      console.error("Logout failed", error);
      toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
    }
  };

  if (!mounted || authLoading) {
    return (
        <>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
             <div className="flex items-center justify-center h-[28px]">
             </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 px-2 py-2">
            {mainNavItems.map((item) => ( 
              <SidebarMenuItem key={item.href + "-skeleton"}>
                <div className="flex items-center font-medium text-sm h-10 p-2">
                  <item.icon className="h-5 w-5 text-sidebar-foreground/70 mr-2" />
                </div>
              </SidebarMenuItem>
            ))}
        </SidebarContent>
        <SidebarFooter className="p-3 mt-auto border-t border-sidebar-border space-y-2">
            <div className="flex items-center gap-3 p-1 h-[48px]">
                <div className="h-9 w-9 rounded-full bg-muted"></div>
                <div className="h-9 w-96 max-w-[100px] bg-muted rounded"></div>
            </div>
            <div className="h-9 w-full bg-muted rounded"></div>
        </SidebarFooter>
        </>
    );
  }


  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center h-[28px]", open ? "justify-between" : "justify-center")}>
          {open && <Logo />}
          {!open && !isMobile && (
            <Link href="/" className="text-primary">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.24 7.76C15.07 6.59 13.53 6 12 6V18C14.05 18 15.92 17.18 17.31 15.79C20.44 12.67 20.44 7.56 17.31 4.43C15.92 3.05 14.05 2.22 12 2.22L12 6C13.53 6 15.07 6.59 16.24 7.76ZM7.76 16.24C6.59 15.07 6 13.53 6 12L18 12C18 14.05 17.18 15.92 15.79 17.31C12.67 20.44 7.56 20.44 4.43 17.31C3.05 15.92 2.22 14.05 2.22 12L6 12C6 13.53 6.59 15.07 7.76 16.24Z" fill="currentColor"/>
              </svg>
            </Link>
          )}
           {isMobile && (
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("ml-auto", openMobile ? "" : "absolute top-3 left-3 z-50")}>
                <PanelLeft />
             </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 px-2 py-2">
        <SidebarMenu>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href}>
                <TooltipProvider delayDuration={state === 'collapsed' ? 0 : 500}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton
                          isActive={isActive}
                          className={cn(
                            "font-medium text-sm h-10",
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground" // Use sidebar-specific colors for active state
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5",
                            isActive
                              ? "text-sidebar-primary-foreground" // Use sidebar-specific foreground for active icon
                              : "text-sidebar-foreground/70 group-hover/menu-button:text-sidebar-accent-foreground"
                          )} />
                          {open && <span>{item.label}</span>}
                        </SidebarMenuButton>
                      </Link>
                    </TooltipTrigger>
                    {state === 'collapsed' && !isMobile && (
                      <TooltipContent side="right" className="font-body bg-background text-foreground border-border">
                        {item.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-3 mt-auto border-t border-sidebar-border space-y-2">
        {open && user && (
          <>
            <div className="flex items-center gap-3 p-1 rounded-md hover:bg-sidebar-accent cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`} alt={user.displayName || user.email || "User"} data-ai-hint="user avatar"/>
                <AvatarFallback>{user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-sidebar-foreground">{user.displayName || user.email?.split('@')[0]}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <Button 
              type="button" // Changed from submit
              variant="ghost" 
              className="w-full justify-start text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLogout} // Added onClick handler
            >
              <LogOut className="mr-2 h-5 w-5 text-sidebar-foreground/70" /> Logout
            </Button>
          </>
        )}
         {state === 'collapsed' && !isMobile && user && (
          <div className="space-y-2 flex flex-col items-center">
             <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png?text=${user.email?.[0]?.toUpperCase() || 'U'}`} alt={user.displayName || user.email || "User"} data-ai-hint="user avatar"/>
                            <AvatarFallback>{user.displayName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-body bg-background text-foreground border-border">{user.displayName || user.email}</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button 
                            type="button" // Changed from submit
                            variant="ghost" 
                            size="icon" 
                            className="w-9 h-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            onClick={handleLogout} // Added onClick handler
                         >
                            <LogOut className="h-5 w-5 text-sidebar-foreground/70"/>
                         </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-body bg-background text-foreground border-border">Logout</TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </SidebarFooter>
    </>
  );
}
