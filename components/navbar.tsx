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

const mainLinks = [
  { href: '/', label: 'Home', label_en: 'Home' },
  { href: '/corsi', label: 'Corsi', label_en: 'Courses' },
  { href: '/regate', label: 'Regate', label_en: 'Regattas' },
  { href: '/chi-siamo', label: 'Chi Siamo', label_en: 'About Us' },
  { href: '/news', label: 'News', label_en: 'News' },
  { href: '/gallery', label: 'Gallery', label_en: 'Gallery' },
  { href: '/contatti', label: 'Contatti', label_en: 'Contact' },
];

const moreLinks = [
  { href: '/calendario', label: 'Calendario', label_en: 'Calendar', icon: Calendar },
  { href: '/come-trovarci', label: 'Come Trovarci', label_en: 'How to Find Us', icon: MapPin },
  { href: '/meteo', label: 'Meteo', label_en: 'Weather', icon: CloudSun },
  { href: '/dove-dormire', label: 'Dove Dormire', label_en: 'Where to Stay', icon: Sun },
  { href: '/faq', label: 'FAQ', label_en: 'FAQ', icon: HelpCircle },
  { href: '/associazione', label: 'L\'Associazione', label_en: 'The Association', icon: Users },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const { user, profile, signOut } = useAuth();
  const { locale, setLocale } = useLocale();
  const t = (it: string, en: string) => locale === 'en' ? en : it;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Anchor className="h-7 w-7 text-[hsl(199,89%,48%)]" />
          <span className="text-lg font-bold tracking-tight text-[hsl(210,50%,20%)]">
            Centro Vela <span className="text-[hsl(199,89%,48%)]">Dervio</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[hsl(199,89%,48%)] ${
                pathname === link.href ? 'text-[hsl(199,89%,48%)]' : 'text-slate-600'
              }`}
            >
              {t(link.label, link.label_en)}
            </Link>
          ))}

          {/* Dropdown DI più */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-slate-600 hover:text-[hsl(199,89%,48%)] bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                  {t('Di più', 'More')} <ChevronDown className="h-3 w-3 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-56 p-2 bg-white rounded-lg shadow-lg border">
                    {moreLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <NavigationMenuLink className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-600 hover:text-[hsl(199,89%,48%)] hover:bg-slate-50 transition-colors">
                          <link.icon className="h-4 w-4 shrink-0" />
                          {t(link.label, link.label_en)}
                        </NavigationMenuLink>
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language switcher */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === 'it' ? 'en' : 'it')}
            className="gap-1 text-slate-500 hover:text-[hsl(199,89%,48%)]"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-bold">{locale.toUpperCase()}</span>
          </Button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {profile?.role === 'admin' ? 'Admin' : t('Area Riservata', 'Dashboard')}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">
                {t('Accedi', 'Sign In')}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-white overflow-y-auto">
            <div className="flex flex-col gap-6 mt-8">
              {/* Language switcher mobile */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocale(locale === 'it' ? 'en' : 'it')}
                className="w-full gap-2"
              >
                <Globe className="h-4 w-4" />
                {locale === 'it' ? 'English' : 'Italiano'}
              </Button>
              <hr />

              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-[hsl(199,89%,48%)] ${
                    pathname === link.href ? 'text-[hsl(199,89%,48%)]' : 'text-slate-700'
                  }`}
                >
                  {t(link.label, link.label_en)}
                </Link>
              ))}
              <hr />
              <div className="text-sm font-bold text-slate-400 uppercase">{t('Di più', 'More')}</div>
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium text-slate-600 hover:text-[hsl(199,89%,48%)] transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {t(link.label, link.label_en)}
                </Link>
              ))}
              <hr />
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/admin" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">
                      {t('Area Riservata', 'Dashboard')}
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={signOut} className="w-full gap-2">
                    <LogOut className="h-4 w-4" /> {t('Esci', 'Logout')}
                  </Button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">
                    {t('Accedi', 'Sign In')}
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
