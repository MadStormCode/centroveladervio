import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth-context';
import { LocaleProvider } from '@/components/locale-context';
import { PageLayout } from '@/components/page-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Centro Vela Dervio - Scuola di Vela sul Lago di Como',
  description: 'Corsi di vela per tutti i livelli, regate, eventi e attività nautiche sul Lago di Como. Scuola vela Dervio, società sportiva dilettantistica.',
  keywords: 'vela, scuola vela, Dervio, Lago di Como, corsi vela, regate, optimist, laser, 420, skiff',
  openGraph: {
    title: 'Centro Vela Dervio',
    description: 'Scuola di vela sul Lago di Como - Corsi, regate e attività per tutti',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <AuthProvider>
          <LocaleProvider>
            <PageLayout>{children}</PageLayout>
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
