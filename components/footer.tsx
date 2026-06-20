import Link from 'next/link';
import { Anchor, Facebook, Instagram, Youtube, Mail, Phone, MapPin, Calendar, CloudSun, HelpCircle, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[hsl(210,50%,12%)] text-white/80">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Anchor className="h-6 w-6 text-[hsl(199,89%,48%)]" />
              <span className="text-lg font-bold text-white">Centro Vela Dervio</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Società Sportiva Dilettantistica - Scuola di vela sul Lago di Como dal 1975.
            </p>
            <div className="flex gap-3">
              <Link href="https://facebook.com/centroveladervio" target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-[hsl(199,89%,48%)] transition-colors">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="https://instagram.com/centroveladervio" target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-[hsl(199,89%,48%)] transition-colors">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="https://youtube.com/centroveladervio" target="_blank" className="p-2 rounded-full bg-white/10 hover:bg-[hsl(199,89%,48%)] transition-colors">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Link Utili</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/corsi" className="hover:text-[hsl(199,89%,48%)] transition-colors">Corsi di Vela</Link></li>
              <li><Link href="/regate" className="hover:text-[hsl(199,89%,48%)] transition-colors">Regate & Eventi</Link></li>
              <li><Link href="/chi-siamo" className="hover:text-[hsl(199,89%,48%)] transition-colors">Chi Siamo</Link></li>
              <li><Link href="/calendario" className="hover:text-[hsl(199,89%,48%)] transition-colors">Calendario</Link></li>
              <li><Link href="/news" className="hover:text-[hsl(199,89%,48%)] transition-colors">News</Link></li>
              <li><Link href="/gallery" className="hover:text-[hsl(199,89%,48%)] transition-colors">Gallery</Link></li>
              <li><Link href="/contatti" className="hover:text-[hsl(199,89%,48%)] transition-colors">Contatti</Link></li>
            </ul>
          </div>

          {/* Info Pages */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informazioni</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/come-trovarci" className="hover:text-[hsl(199,89%,48%)] transition-colors flex items-center gap-2"><MapPin className="h-3 w-3" /> Come Trovarci</Link></li>
              <li><Link href="/dove-dormire" className="hover:text-[hsl(199,89%,48%)] transition-colors flex items-center gap-2"><MapPin className="h-3 w-3" /> Dove Dormire</Link></li>
              <li><Link href="/meteo" className="hover:text-[hsl(199,89%,48%)] transition-colors flex items-center gap-2"><CloudSun className="h-3 w-3" /> Meteo</Link></li>
              <li><Link href="/faq" className="hover:text-[hsl(199,89%,48%)] transition-colors flex items-center gap-2"><HelpCircle className="h-3 w-3" /> FAQ</Link></li>
              <li><Link href="/associazione" className="hover:text-[hsl(199,89%,48%)] transition-colors flex items-center gap-2"><Users className="h-3 w-3" /> Associazione</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-[hsl(199,89%,48%)]" />
                <span>Via Lungolago, 1<br />23824 Dervio (LC)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[hsl(199,89%,48%)]" />
                <span>+39 0341 123456</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[hsl(199,89%,48%)]" />
                <span>info@centroveladervio.it</span>
              </li>
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[hsl(199,89%,48%)]" />
                <span>Lun-Ven: 9:00-18:00<br />Sab-Dom: 9:00-13:00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50">
          <span>Centro Vela Dervio - SSD - P.IVA 01234567890</span>
          <span>© {new Date().getFullYear()} Tutti i diritti riservati</span>
        </div>
      </div>
    </footer>
  );
}
