import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Search, Sun, Bed, Clock, ChevronRight } from 'lucide-react';

export const revalidate = 60;

async function getCourses() {
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export default async function CorsiPage() {
  const courses = await getCourses();

  const levels = Array.from(new Set(courses.map(c => c.level)));
  const categories = Array.from(new Set(courses.map(c => c.category)));

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920" alt="" fill className="object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Scuola di Vela</h1>
          <p className="text-white/70 max-w-2xl">
            Corsi estivi a settimane. Scegli tra corso diurno (solo ore di vela) o campus (alloggio + pasti + attivita serali). 
            Dal 15 giugno al 14 agosto, 8 settimane a disposizione.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Cerca corso..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Livello" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti</SelectItem>
                  {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={course.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <Badge className="bg-white/90 text-[hsl(210,50%,20%)]">{course.level}</Badge>
                    <div className="flex gap-1">
                      <Badge className="bg-[hsl(199,89%,48%)]/90 text-white text-xs">{course.weeks_count} settimane</Badge>
                      <Badge className="bg-emerald-500/90 text-white text-xs">{course.school_period}</Badge>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.short_description}</p>
                  
                  {/* Price options */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-slate-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                        <Sun className="h-4 w-4" />
                        <span className="text-xs font-medium">Diurno</span>
                      </div>
                      <div className="text-lg font-bold text-[hsl(199,89%,48%)]">€{course.price_day}</div>
                      <div className="text-xs text-slate-400">/settimana</div>
                    </div>
                    <div className="flex-1 bg-[hsl(199,89%,48%)]/5 rounded-lg p-3 text-center border border-[hsl(199,89%,48%)]/20">
                      <div className="flex items-center justify-center gap-1 text-[hsl(199,89%,48%)] mb-1">
                        <Bed className="h-4 w-4" />
                        <span className="text-xs font-medium">Campus</span>
                      </div>
                      <div className="text-lg font-bold text-[hsl(199,89%,48%)]">€{course.price_campus}</div>
                      <div className="text-xs text-slate-400">/settimana</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.current_participants}/{course.max_participants}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {course.weeks_count} settimane</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {course.category}</span>
                    <span className="flex items-center gap-1">{course.age_min}-{course.age_max} anni</span>
                  </div>
                  <Link href={`/corsi/${course.slug}`}>
                    <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2">
                      Dettagli e Iscrizione <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
