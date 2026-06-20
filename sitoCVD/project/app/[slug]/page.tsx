import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Bed, HelpCircle, Users, Calendar, CloudSun, Sun } from 'lucide-react';

export const revalidate = 60;

const iconMap: Record<string, any> = {
  MapPin, Bed, HelpCircle, Users, Calendar, CloudSun, Sun,
};

async function getPage(slug: string) {
  const { data } = await supabase
    .from('site_pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

export default async function SitePage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) return notFound();

  const IconComp = iconMap[page.icon || ''] || MapPin;

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const bold = line.match(/^\*\*(.+?)\*\*(.*)$/);
      if (bold) {
        return <h3 key={i} className="text-lg font-bold text-[hsl(210,50%,20%)] mt-6 mb-3">{bold[1]}{bold[2]}</h3>;
      }
      const bullet = line.match(/^\* (.+)$/);
      if (bullet) {
        return <li key={i} className="text-sm text-slate-600 ml-4 list-disc">{bullet[1]}</li>;
      }
      if (line.trim().startsWith('-')) {
        return <li key={i} className="text-sm text-slate-600 ml-4 list-disc">{line.trim().substring(1).trim()}</li>;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-sm text-slate-600 leading-relaxed">{line}</p>;
    });
  };

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="text-white mb-4 hover:bg-white/20 gap-2">
              <ArrowLeft className="h-4 w-4" /> Indietro
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
              <IconComp className="h-6 w-6 text-[hsl(199,89%,48%)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{page.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 md:p-8 space-y-2">
                {renderMarkdown(page.content)}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
