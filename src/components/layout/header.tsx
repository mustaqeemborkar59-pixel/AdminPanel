
"use client";
// Changed import to use the canonical useSidebar from ui/sidebar
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"; 

export function Header() {
  // The useSidebar hook from "@/components/ui/sidebar" provides the necessary context
  // and will throw an error if not used within a SidebarProvider.
  // It directly provides isMobile and open (desktop sidebar state).
  const { isMobile, open } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* Show SidebarTrigger if on mobile, or if on desktop and sidebar is collapsed */}
      {isMobile || !open ? <SidebarTrigger /> : null}
      {/* Add other header elements like User Profile Dropdown here */}
      <div className="flex-1 text-right">
        {/* Example: User Profile or Settings */}
      </div>
    </header>
  );
}
