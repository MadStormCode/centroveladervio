import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowLeft, User, Tag } from 'lucide-react';

export const revalidate = 60;

async function getNewsItem(slug: string) {
  const { data } = await supabase.from('news').select('*').eq('slug', slug).eq('status', 'published').single();
  return data;
}

async function getRelatedNews(category: string, excludeSlug: string) {
  const { data } = await supabase.from('news').select('*').eq('category', category).eq('status', 'published').neq('slug', excludeSlug).order('published_at', { ascending: false }).limit(3);
  return data ?? [];
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const item = await getNewsItem(params.slug);
  if (!item) return notFound();
  const related = await getRelatedNews(item.category, item.slug);

  return (
    <>
      <section className="relative h-72 overflow-hidden">
        <Image src={item.image_url || 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=1920'} alt={item.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto px-4 lg:px-8">
            <Link href="/news">
              <Button variant="ghost" className="text-white mb-4 hover:bg-white/20 gap-2"><ArrowLeft className="h-4 w-4" /> Torna alle news</Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{item.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm text-slate-400">
                <Badge variant="outline">{item.category}</Badge>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {item.published_at && new Date(item.published_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed mb-6">{item.excerpt}</p>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">{item.content}</div>
              </div>
            </div>

            <div>
              {related.length > 0 && (
                <Card className="border-0 shadow-lg sticky top-24">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2"><Tag className="h-4 w-4" /> Articoli correlati</h3>
                    <div className="space-y-4">
                      {related.map((r) => (
                        <Link key={r.id} href={`/news/${r.slug}`} className="group block">
                          <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                            <Image src={r.image_url || 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=400'} alt={r.title} fill className="object-cover transition-transform group-hover:scale-110" />
                          </div>
                          <h4 className="text-sm font-bold text-[hsl(210,50%,20%)] group-hover:text-[hsl(199,89%,48%)] transition-colors line-clamp-2">{r.title}</h4>
                          <div className="text-xs text-slate-400 mt-1">{r.published_at && new Date(r.published_at).toLocaleDateString('it-IT')}</div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
