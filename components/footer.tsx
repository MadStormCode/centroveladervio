'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/useTranslation';
import { Anchor, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Calendar, CloudSun, HelpCircle, Users } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { href: '/corsi', label: t('nav_courses') },
    { href: '/regate', label: t('nav_regattas') },
    { href: '/chi-siamo', label: t('nav_about') },
    { href: '/calendario', label: t('nav_calendar') },
    { href: '/news', label: t('nav_news') },
    { href: '/gallery', label: t('nav_gallery') },
    { href: '/contatti', label: t('nav_contact') },
  ];

  const infoLinks = [
    { href: '/come-trovarci', label: t('nav_how_to_find'), icon: MapPin },
    { href: '/dove-dormire', label: t('nav_where_to_stay'), icon: MapPin },
    { href: '/meteo', label: t('nav_weather'), icon: CloudSun },
    { href: '/faq', label: t('nav_faq'), icon: HelpCircle },
    { href: '/associazione', label: t('nav_association'), icon: Users },
  ];

  return (
    <footer className="bg-[hsl(210,50%,12%)] text-white/80">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Anchor className="h-6 w-6 text-[hsl(199,89%,48%)]" />
              <span className="text-lg font-bold text-white">Centro Vela Dervio</span>
            </Link>
            <p className="text-sm leading-relaxed">Società Sportiva Dilettantistica - Scuola di vela sul Lago di Como dal 1975.</p>
            <div className="flex gap-3">
              <Link href="https://facebook.com/centroveladervio" target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-[hsl(199,89%,48%)] transition-colors"><Facebook className="h-4 w-4" /></Link>
              <Link href="https://instagram.com/centroveladervio" target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-[hsl(199,89%,48%)] transition-colors"><Instagram className="h-4 w-4" /></Link>
              <Link href="https://youtube.com/centroveladervio" target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-[hsl(199,89%,48%)] transition-colors"><Youtube className="h-4 w-4" /></Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-[hsl(199,89%,48%)] transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_info')}</h3>
            <ul className="space-y-2 text-sm">
              {infoLinks.map(link => (
                <li key={link.href}><Link href={link.href} className="hover:text-[hsl(199,89%,48%)] transition-colors flex items-center gap-2"><link.icon className="h-3 w-3" /> {link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer_contacts')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-[hsl(199,89%,48%)]" /><span>{t('footer_address')}</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[hsl(199,89%,48%)]" /><span>{t('footer_phone')}</span></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[hsl(199,89%,48%)]" /><span>{t('footer_email')}</span></li>
              <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[hsl(199,89%,48%)]" /><span>{t('footer_hours')}<br />{t('footer_weekend')}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50">
          <span>{t('footer_copyright')}</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
