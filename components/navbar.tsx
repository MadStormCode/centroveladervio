'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu, Anchor, User, LogOut, ChevronDown, Globe, MapPin, CloudSun, Calendar, HelpCircle, Users, Sun } from 'lucide-react';
import { useAuth } from '@/components/auth-context';
import { useLocale } from '@/components/locale-context';
import { useTranslation } from '@/lib/useTranslation';

const mainLinks = [
  { href: '/', key: 'nav_home' },
  { href: '/corsi', key: 'nav_courses' },
  { href: '/regate', key: 'nav_regattas' },
  { href: '/chi-siamo', key: 'nav_about' },
  { href: '/news', key: 'nav_news' },
  { href: '/gallery', key: 'nav_gallery' },
  { href: '/contatti', key: 'nav_contact' },
];

const moreNavLinks = [
  { href: '/calendario', key: 'nav_calendar', icon: Calendar },
  { href: '/come-trovarci', key: 'nav_how_to_find', icon: MapPin },
  { href: '/meteo', key: 'nav_weather', icon: CloudSun },
  { href: '/dove-dormire', key: 'nav_where_to_stay', icon: Sun },
  { href: '/faq', key: 'nav_faq', icon: HelpCircle },
  { href: '/associazione', key: 'nav_association', icon: Users },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const { user, profile, signOut } = useAuth();
  const { locale, setLocale } = useLocale();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Anchor className="h-7 w-7 text-[hsl(199,89%,48%)]" />
          <span className="text-lg font-bold tracking-tight text-[hsl(210,50%,20%)]">
            Centro Vela <span className="text-[hsl(199,89%,48%)]">Dervio</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5">
          {mainLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[hsl(199,89%,48%)] ${pathname === link.href ? 'text-[hsl(199,89%,48%)]' : 'text-slate-600'}`}>
              {t(link.key)}
            </Link>
          ))}

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-slate-600 hover:text-[hsl(199,89%,48%)] bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                  {t('nav_more')} <ChevronDown className="h-3 w-3 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-56 p-2 bg-white rounded-lg shadow-lg border">
                    {moreNavLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <NavigationMenuLink className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-600 hover:text-[hsl(199,89%,48%)] hover:bg-slate-50 transition-colors">
                          <link.icon className="h-4 w-4 shrink-0" />
                          {t(link.key)}
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setLocale(locale === 'it' ? 'en' : 'it')}
            className="gap-1 text-slate-500 hover:text-[hsl(199,89%,48%)]">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-bold">{locale.toUpperCase()}</span>
          </Button>
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {profile?.role === 'admin' ? 'Admin' : t('nav_dashboard')}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">{t('nav_signin')}</Button>
            </Link>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white overflow-y-auto">
            <div className="flex flex-col gap-6 mt-8">
              <Button variant="outline" size="sm" onClick={() => setLocale(locale === 'it' ? 'en' : 'it')} className="w-full gap-2">
                <Globe className="h-4 w-4" />{locale === 'it' ? 'English' : 'Italiano'}
              </Button>
              <hr />
              {mainLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-[hsl(199,89%,48%)] ${pathname === link.href ? 'text-[hsl(199,89%,48%)]' : 'text-slate-700'}`}>
                  {t(link.key)}
                </Link>
              ))}
              <hr />
              <div className="text-sm font-bold text-slate-400 uppercase">{t('nav_more')}</div>
              {moreNavLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-[hsl(199,89%,48%)] transition-colors">
                  <link.icon className="h-4 w-4" />{t(link.key)}
                </Link>
              ))}
              <hr />
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">{t('nav_dashboard')}</Button>
                  </Link>
                  <Button variant="outline" onClick={signOut} className="w-full gap-2">
                    <LogOut className="h-4 w-4" />{t('nav_signout')}
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">{t('nav_signin')}</Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
