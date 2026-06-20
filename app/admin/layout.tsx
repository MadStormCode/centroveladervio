'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard, BookOpen, Trophy, ClipboardList, Newspaper, ImageIcon, 
  FileText, Settings, Users, ChevronLeft, Menu, LogOut, Anchor
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/corsi', label: 'Corsi', icon: BookOpen },
  { href: '/admin/regate', label: 'Regate', icon: Trophy },
  { href: '/admin/iscrizioni', label: 'Iscrizioni', icon: ClipboardList },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/documenti', label: 'Documenti', icon: FileText },
  { href: '/admin/utenti', label: 'Utenti', icon: Users },
  { href: '/admin/impostazioni', label: 'Impostazioni', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Caricamento...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white fixed h-full z-30">
        <div className="h-16 flex items-center gap-2 px-6 border-b">
          <Anchor className="h-6 w-6 text-[hsl(199,89%,48%)]" />
          <span className="font-bold text-[hsl(210,50%,20%)]">Admin Panel</span>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[hsl(199,89%,48%)] transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[hsl(199,89%,48%)]/10 flex items-center justify-center text-[hsl(199,89%,48%)] text-sm font-bold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="text-sm">
              <div className="font-medium text-[hsl(210,50%,20%)]">{profile?.full_name || 'Utente'}</div>
              <div className="text-xs text-slate-400 capitalize">{profile?.role}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="ghost" size="sm" className="w-full gap-1 text-xs text-slate-500">
                <ChevronLeft className="h-3 w-3" /> Sito
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="flex-1 gap-1 text-xs text-slate-500" onClick={signOut}>
              <LogOut className="h-3 w-3" /> Esci
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Anchor className="h-6 w-6 text-[hsl(199,89%,48%)]" />
          <span className="font-bold text-[hsl(210,50%,20%)]">Admin Panel</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-16 flex items-center gap-2 px-6 border-b">
              <Anchor className="h-6 w-6 text-[hsl(199,89%,48%)]" />
              <span className="font-bold text-[hsl(210,50%,20%)]">Admin Panel</span>
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)] py-4">
              <nav className="space-y-1 px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-[hsl(199,89%,48%)] transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Link href="/" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">Sito</Button>
                </Link>
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={signOut}>Esci</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <div className="lg:h-16" /> {/* spacer for mobile header */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
