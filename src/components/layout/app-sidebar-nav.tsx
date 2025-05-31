
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  LineChart,
  LogOut, 
  Sun,
  Moon,
  Laptop,
  CheckIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import React from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/menu', label: 'Menu', icon: Utensils },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/tables', label: 'Table Services', icon: SquareStack },
  { href: '/reservations', label: 'Reservation', icon: CalendarCheck },
  { href: '/delivery', label: 'Delivery', icon: Truck },
  { href: '/inventory', label: 'Inventory', icon: Archive },
  { href: '/specials', label: 'Specials', icon: Sparkles },
  { href: '/accounting', label: 'Accounting', icon: LineChart },
  { href: '/staff', label: 'Staff', icon: UsersRound },
];

export function AppSidebarNav() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile, state, openMobile } = useSidebar();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);


  const settingsDropdownContent = (
    <DropdownMenuContent align="end" sideOffset={state === 'collapsed' && !isMobile ? 10 : 5} className="w-48">
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
        <DropdownMenuRadioItem value="light" className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === "light" && <CheckIcon className="ml-auto h-4 w-4" />}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark" className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
           {theme === "dark" && <CheckIcon className="ml-auto h-4 w-4" />}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system" className="cursor-pointer">
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
           {theme === "system" && <CheckIcon className="ml-auto h-4 w-4" />}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      {/* Add other settings items here if needed */}
    </DropdownMenuContent>
  );

  if (!mounted) {
    // Prevent hydration mismatch for theme-dependent UI
    return (
        <>
        <SidebarHeader className="p-4 border-b border-sidebar-border">
            <div className={cn("flex items-center justify-between", !open && isMobile ? "" : (open ? "" : "justify-center"))}>
            {open && <Logo />}
            </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 px-2 py-2">
            {/* You can put skeleton loaders here if you prefer */}
        </SidebarContent>
        <SidebarFooter className="p-3 mt-auto border-t border-sidebar-border space-y-2">
            {/* Footer skeleton or placeholder */}
        </SidebarFooter>
        </>
    );
  }


  return (
    <>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center justify-between", !open && isMobile ? "" : (open ? "" : "justify-center"))}>
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
          {navItems.map((item) => {
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
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5", 
                            isActive 
                              ? "text-primary-foreground" 
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
        {open && (
          <>
            <div className="flex items-center gap-3 p-1 rounded-md hover:bg-sidebar-accent cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/40x40.png?text=FM" alt="Floyd Miles" data-ai-hint="user avatar" />
                <AvatarFallback>FM</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-sidebar-foreground">Floyd Miles</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                  <Settings className="mr-2 h-5 w-5 text-sidebar-foreground/70" /> Settings
                </Button>
              </DropdownMenuTrigger>
              {settingsDropdownContent}
            </DropdownMenu>
            <Button variant="ghost" className="w-full justify-start text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="mr-2 h-5 w-5 text-sidebar-foreground/70" /> Logout
            </Button>
          </>
        )}
         {state === 'collapsed' && !isMobile && (
          <div className="space-y-2 flex flex-col items-center">
             <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Avatar className="h-9 w-9">
                            <AvatarImage src="https://placehold.co/40x40.png?text=FM" alt="Floyd Miles" data-ai-hint="user avatar"/>
                            <AvatarFallback>FM</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-body bg-background text-foreground border-border">Floyd Miles</TooltipContent>
                </Tooltip>
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-9 h-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                          <Settings className="h-5 w-5 text-sidebar-foreground/70"/>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-body bg-background text-foreground border-border">Settings</TooltipContent>
                  </Tooltip>
                  {settingsDropdownContent}
                </DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon" className="w-9 h-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"><LogOut className="h-5 w-5 text-sidebar-foreground/70"/></Button>
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
