import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Calendar, MapPin, Users, Clock, User, ArrowLeft, CheckCircle,
  Sun, Bed, Star, Shirt, UtensilsCrossed, Home, Backpack, ChevronRight
} from 'lucide-react';

export const revalidate = 60;

async function getCourse(slug: string) {
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

async function getCourseWeeks(courseId: string) {
  const { data } = await supabase
    .from('course_weeks')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_active', true)
    .order('week_number', { ascending: true });
  return data ?? [];
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) return notFound();
  const weeks = await getCourseWeeks(course.id);

  const highlights = course.highlights || [];
  const dailyProgram = course.daily_program || '';
  const programLines = dailyProgram.split('\n').filter((l: string) => l.trim());

  return (
    <>
      <section className="relative h-80 overflow-hidden">
        <Image
          src={course.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920'}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto px-4 lg:px-8">
            <Link href="/corsi">
              <Button variant="ghost" className="text-white mb-4 hover:bg-white/20 gap-2">
                <ArrowLeft className="h-4 w-4" /> Torna ai corsi
              </Button>
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-[hsl(199,89%,48%)] text-white">{course.level}</Badge>
              <Badge className="bg-white/90 text-[hsl(210,50%,20%)]">{course.weeks_count} settimane</Badge>
              <Badge className="bg-emerald-500/90 text-white">{course.school_period}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{course.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4">Descrizione</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>

              {/* Highlights */}
              {highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2">
                    <Star className="h-6 w-6 text-[hsl(199,89%,48%)]" /> Cosa include
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {highlights.map((h: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-[hsl(165,55%,50%)] shrink-0" />
                        <span className="text-sm text-slate-700">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Program */}
              {programLines.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-[hsl(199,89%,48%)]" /> Una giornata tipo
                  </h2>
                  <div className="bg-slate-50 rounded-xl p-6 space-y-3">
                    {programLines.map((line: string, i: number) => {
                      const [time, ...desc] = line.split('-');
                      return (
                        <div key={i} className="flex gap-4">
                          <div className="w-16 text-sm font-bold text-[hsl(199,89%,48%)] shrink-0">{time.trim()}</div>
                          <div className="text-sm text-slate-600">{desc.join('-').trim()}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Info cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">{course.age_min}-{course.age_max} anni</div>
                    <div className="text-xs text-slate-400">Fascia eta</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">{course.weeks_count} settimane</div>
                    <div className="text-xs text-slate-400">Dal lunedi al sabato</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <User className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">{course.instructor}</div>
                    <div className="text-xs text-slate-400">Istruttore FIV</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Shirt className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">Attrezzatura inclusa</div>
                    <div className="text-xs text-slate-400">{course.gear_included}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Backpack className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">Cosa portare</div>
                    <div className="text-xs text-slate-400">{course.what_to_bring}</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4 text-center">
                    <Home className="h-6 w-6 mx-auto mb-2 text-[hsl(199,89%,48%)]" />
                    <div className="text-sm font-bold">{course.accommodation_included ? 'Campus incluso' : 'Solo diurno'}</div>
                    <div className="text-xs text-slate-400">{course.meal_included ? 'Pasti inclusi' : 'Pasti non inclusi'}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Schedule comparison */}
              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4">Orari</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Sun className="h-5 w-5 text-amber-500" />
                        <h3 className="font-bold text-[hsl(210,50%,20%)]">Corso Diurno</h3>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{course.day_schedule}</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Solo ore di vela</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Pranzo al sacco</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Attrezzatura inclusa</li>
                        <li className="flex items-center gap-2 text-slate-400 line-through">Alloggio</li>
                        <li className="flex items-center gap-2 text-slate-400 line-through">Pasti serali</li>
                        <li className="flex items-center gap-2 text-slate-400 line-through">Attivita serali</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-md border-l-4 border-l-[hsl(199,89%,48%)]">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Bed className="h-5 w-5 text-[hsl(199,89%,48%)]" />
                        <h3 className="font-bold text-[hsl(210,50%,20%)]">Campus</h3>
                        <Badge className="bg-[hsl(199,89%,48%)] text-white text-xs">Consigliato</Badge>
                      </div>
                      <p className="text-sm text-slate-500 mb-2">{course.campus_schedule}</p>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Alloggio in camerate</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Colazione, pranzo e cena</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Attrezzatura inclusa</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Attivita serali</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Assistenza 24h</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-emerald-500" /> Ore di vela</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Weeks Table */}
              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4">Calendario Settimane</h2>
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Settimana</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Prezzo Diurno</TableHead>
                        <TableHead>Prezzo Campus</TableHead>
                        <TableHead>Posti</TableHead>
                        <TableHead>Stato</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weeks.map((w) => (
                        <TableRow key={w.id}>
                          <TableCell className="font-medium">Settimana {w.week_number}</TableCell>
                          <TableCell>
                            {new Date(w.start_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - {new Date(w.end_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                          </TableCell>
                          <TableCell className="text-amber-600 font-medium">€{w.price_day}</TableCell>
                          <TableCell className="text-[hsl(199,89%,48%)] font-medium">€{w.price_campus}</TableCell>
                          <TableCell>{w.spots_booked}/{w.spots_total}</TableCell>
                          <TableCell>
                            <Badge className={w.spots_booked < w.spots_total ? 'bg-emerald-500' : 'bg-red-500'}>
                              {w.spots_booked < w.spots_total ? 'Disponibile' : 'Esaurito'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24 border-0 shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Scegli la tua opzione</div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Sun className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium text-slate-700">Corso Diurno</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-700">€{course.price_day}<span className="text-sm font-normal text-slate-400">/settimana</span></div>
                      <p className="text-xs text-slate-400 mt-1">Solo ore di vela, pranzo al sacco</p>
                    </div>
                    <div className="bg-[hsl(199,89%,48%)]/5 rounded-lg p-4 border border-[hsl(199,89%,48%)]/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Bed className="h-4 w-4 text-[hsl(199,89%,48%)]" />
                        <span className="text-sm font-medium text-[hsl(210,50%,20%)]">Campus</span>
                        <Badge className="bg-[hsl(199,89%,48%)] text-white text-xs">Consigliato</Badge>
                      </div>
                      <div className="text-2xl font-bold text-[hsl(199,89%,48%)]">€{course.price_campus}<span className="text-sm font-normal text-slate-400">/settimana</span></div>
                      <p className="text-xs text-slate-400 mt-1">Alloggio + pasti + attivita serali</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-[hsl(199,89%,48%)] h-2 rounded-full transition-all"
                      style={{ width: `${(course.current_participants / course.max_participants) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    {course.max_participants - course.current_participants} posti rimasti
                  </div>
                  <Link href={`/iscrizioni?type=course&id=${course.id}`}>
                    <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2" size="lg">
                      Iscriviti al Corso <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {!course.registrations_open && (
                    <p className="text-xs text-center text-red-500">Iscrizioni temporaneamente chiuse</p>
                  )}
                  <div className="text-xs text-slate-400 text-center space-y-1 pt-2 border-t">
                    <div className="flex items-center gap-1 justify-center"><Calendar className="h-3 w-3" /> {course.school_period}</div>
                    <div className="flex items-center gap-1 justify-center"><Users className="h-3 w-3" /> {course.age_min}-{course.age_max} anni</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
