
import type { Metadata } from 'next';
import './globals.css';
import { AppContentWrapper } from '@/components/layout/app-content-wrapper'; // This is the key
import { Toaster } from '@/components/ui/toaster'; // Global Toaster
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from '@/firebase';


export const metadata: Metadata = {
  title: 'E-commerce Dashboard',
  description: 'Online Shop Management System',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AppContentWrapper>
              {children}
            </AppContentWrapper>
          </FirebaseClientProvider>
          <Toaster /> {/* Global Toaster */}
        </ThemeProvider>
      </body>
    </html>
  );
}
