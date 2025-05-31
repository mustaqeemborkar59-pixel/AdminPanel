
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

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/inventory', label: 'Inventory', icon: Archive },
  { href: '/specials', label: 'Specials', icon: Sparkles },
  { href: '/staff', label: 'Staff', icon: UsersRound },
  // { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebarNav() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile } = useSidebar();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className={cn("flex items-center justify-between", open ? "" : "justify-center")}>
          {open && <Logo />}
          {isMobile && (
             <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                <PanelLeft />
             </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={{ children: item.label, className: "font-body" }}
                    className="font-body"
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      {/* <SidebarFooter className="p-4">
        {open && <p className="text-xs text-sidebar-foreground/70 font-body">© GastroFlow 2024</p>}
      </SidebarFooter> */}
    </>
  );
}
