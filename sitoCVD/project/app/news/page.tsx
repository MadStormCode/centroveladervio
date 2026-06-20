import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, ArrowRight } from 'lucide-react';

export const revalidate = 60;

async function getNews() {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  return data ?? [];
}

export default async function NewsPage() {
  const newsItems = await getNews();
  const featured = newsItems.filter(n => n.featured);
  const regular = newsItems.filter(n => !n.featured);

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=1920" alt="" fill className="object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">News</h1>
          <p className="text-white/70 max-w-2xl">Aggiornamenti, comunicazioni e notizie dal Centro Vela Dervio.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Cerca news..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte</SelectItem>
                <SelectItem value="generale">Generale</SelectItem>
                <SelectItem value="corsi">Corsi</SelectItem>
                <SelectItem value="regate">Regate</SelectItem>
                <SelectItem value="soci">Soci</SelectItem>
                <SelectItem value="eventi">Eventi</SelectItem>
                <SelectItem value="comunicazioni">Comunicazioni</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {featured.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-[hsl(210,50%,20%)] mb-4">In evidenza</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`} className="group">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                      <div className="relative h-64 overflow-hidden">
                        <Image src={item.image_url || 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800'} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="bg-amber-500 text-white mb-3">In evidenza</Badge>
                        <h3 className="text-xl font-bold text-[hsl(210,50%,20%)] mb-2 group-hover:text-[hsl(199,89%,48%)] transition-colors">{item.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{item.excerpt}</p>
                        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.published_at && new Date(item.published_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-bold text-[hsl(210,50%,20%)] mb-4">Tutte le News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regular.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image src={item.image_url || 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800'} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-2 text-xs">{item.category}</Badge>
                    <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-2 group-hover:text-[hsl(199,89%,48%)] transition-colors">{item.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{item.excerpt}</p>
                    <div className="mt-3 text-xs text-slate-400">{item.published_at && new Date(item.published_at).toLocaleDateString('it-IT')}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
