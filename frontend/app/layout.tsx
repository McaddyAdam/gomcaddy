import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'Gomcaddy',
  description: 'Browse restaurants, view menus, add food items to cart, and sign in with Gomcaddy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
