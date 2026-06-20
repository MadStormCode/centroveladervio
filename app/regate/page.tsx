import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Trophy, ArrowRight, Search } from 'lucide-react';

export const revalidate = 60;

async function getRegattas() {
  const { data } = await supabase
    .from('regattas')
    .select('*')
    .eq('is_public', true)
    .order('start_date', { ascending: true });
  return data ?? [];
}

const statusLabels: Record<string, string> = {
  upcoming: 'In programma',
  ongoing: 'In corso',
  completed: 'Completata',
  cancelled: 'Annullata',
};

export default async function RegatePage() {
  const regattas = await getRegattas();
  const upcoming = regattas.filter(r => r.status === 'upcoming');
  const past = regattas.filter(r => r.status === 'completed');

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920" alt="" fill className="object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Regate & Eventi</h1>
          <p className="text-white/70 max-w-2xl">Calendario regate, competizioni ed eventi sul Lago di Como. Partecipa o segui le gare più importanti.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-6">Regate in Programma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((regatta) => (
              <Card key={regatta.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image src={regatta.image_url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'} alt={regatta.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[hsl(199,89%,48%)] text-white">{statusLabels[regatta.status]}</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-2">{regatta.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{regatta.short_description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(regatta.start_date).toLocaleDateString('it-IT')}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {regatta.location}</span>
                  </div>
                  <Link href={`/regate/${regatta.slug}`}>
                    <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">Dettagli e Iscrizione</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {past.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mt-16 mb-6">Regate Concluse</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {past.map((regatta) => (
                  <Card key={regatta.id} className="group border-0 shadow-md opacity-70 hover:opacity-100 transition-all">
                    <div className="relative h-40 overflow-hidden">
                      <Image src={regatta.image_url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'} alt={regatta.title} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-md font-bold text-[hsl(210,50%,20%)]">{regatta.title}</h3>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(regatta.start_date).toLocaleDateString('it-IT')}</div>
                      <Link href={`/regate/${regatta.slug}`}>
                        <Button variant="ghost" className="w-full mt-3 text-[hsl(199,89%,48%)] gap-1">Vedi risultati <ArrowRight className="h-3 w-3" /></Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
