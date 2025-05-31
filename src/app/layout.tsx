
import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebarNav } from '@/components/layout/app-sidebar-nav';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';


export const metadata: Metadata = {
  title: 'GastroFlow POS',
  description: 'Restaurant Management & POS System by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Using Inter as it's a common modern UI font similar to the image */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Removed Alegreya and Belleza as per new UI direction */}
      </head>
      <body className="antialiased"> {/* Removed font-body, will be handled by global css */}
        <SidebarProvider defaultOpen>
          <Sidebar>
            <AppSidebarNav />
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto bg-background"> {/* Ensure main also has bg-background */}
              {children}
            </main>
            <Toaster />
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
