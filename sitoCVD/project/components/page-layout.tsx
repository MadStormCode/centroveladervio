'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { Toaster } from './ui/sonner';

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const hideNavFooter = pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  return (
    <>
      {!hideNavFooter && <Navbar />}
      <main>{children}</main>
      {!hideNavFooter && <Footer />}
      <Toaster />
    </>
  );
}
