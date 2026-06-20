import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ChevronLeft, ChevronRight, Sun, Bed } from 'lucide-react';

export const revalidate = 60;

async function getData() {
  const { data: courses } = await supabase.from('courses').select('*, course_weeks(*)').eq('is_active', true).order('created_at', { ascending: false });
  const { data: regattas } = await supabase.from('regattas').select('*').eq('is_public', true).order('start_date', { ascending: true });
  return { courses: courses ?? [], regattas: regattas ?? [] };
}

const months = ['Giugno', 'Luglio', 'Agosto', 'Settembre'];
const monthStarts = ['2025-06-01', '2025-07-01', '2025-08-01', '2025-09-01'];

export default async function CalendarioPage() {
  const { courses, regattas } = await getData();

  const allWeeks = courses.flatMap((c: any) => (c.course_weeks || []).map((w: any) => ({ ...w, course_title: c.title, course_slug: c.slug, type: 'course' })));
  const regattaEvents = regattas.map((r: any) => ({ ...r, type: 'regatta', title: r.title, course_slug: r.slug }));

  const getEventsForMonth = (monthIndex: number) => {
    const start = new Date(monthStarts[monthIndex]);
    const end = new Date(monthStarts[monthIndex + 1] || '2025-10-01');
    return [
      ...allWeeks.filter((w: any) => {
        const d = new Date(w.start_date);
        return d >= start && d < end;
      }),
      ...regattaEvents.filter((r: any) => {
        const d = new Date(r.start_date);
        return d >= start && d < end;
      })
    ].sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  };

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Calendario</h1>
          <p className="text-white/70">Corsi e regate per l'estate 2025</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {months.map((month, i) => {
              const events = getEventsForMonth(i);
              return (
                <Card key={month} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[hsl(199,89%,48%)]" /> {month} 2025
                    </h2>
                    {events.length === 0 ? (
                      <p className="text-sm text-slate-400 py-4">Nessun evento in programma</p>
                    ) : (
                      <div className="space-y-3">
                        {events.map((e: any) => (
                          <Link key={e.id} href={`/${e.type === 'course' ? 'corsi' : 'regate'}/${e.course_slug}`} className="group flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-[hsl(199,89%,48%)]/10 flex items-center justify-center shrink-0">
                              {e.type === 'course' ? <Sun className="h-5 w-5 text-[hsl(199,89%,48%)]" /> : <MapPin className="h-5 w-5 text-amber-500" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-[hsl(210,50%,20%)] group-hover:text-[hsl(199,89%,48%)] transition-colors">{e.course_title || e.title}</span>
                                <Badge variant="outline" className="text-xs">{e.type === 'course' ? 'Corso' : 'Regata'}</Badge>
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                {new Date(e.start_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                                {e.end_date && ` - ${new Date(e.end_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}`}
                              </div>
                              {e.type === 'course' && (
                                <div className="flex gap-2 mt-1 text-xs">
                                  <span className="text-amber-600">Diurno €{e.price_day}</span>
                                  <span className="text-[hsl(199,89%,48%)]">Campus €{e.price_campus}</span>
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
