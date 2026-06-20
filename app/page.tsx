import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { 
  Anchor, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Users, 
  Wind,
  Trophy,
  BookOpen,
  ImageIcon,
  ChevronRight
} from 'lucide-react';

export const revalidate = 60;

async function getHomeData() {
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3);
  
  const { data: regattas } = await supabase
    .from('regattas')
    .select('*')
    .eq('status', 'upcoming')
    .order('start_date', { ascending: true })
    .limit(3);
  
  const { data: newsItems } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);
  
  const { data: albums } = await supabase
    .from('photo_albums')
    .select('*')
    .eq('is_public', true)
    .order('sort_order', { ascending: true })
    .limit(4);

  return { courses, regattas, newsItems, albums };
}

export default async function HomePage() {
  const { courses, regattas, newsItems, albums } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://www.centroveladervio.it/wp-content/uploads/2025/12/UfoCorretta.jpeg"
            alt="Vela sul Lago di Como"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(210,50%,8%)]/90 via-[hsl(210,50%,8%)]/70 to-[hsl(210,50%,8%)]/40" />
        </div>

        <div className="container relative z-10 mx-auto px-4 lg:px-8 py-20">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-[hsl(199,89%,48%)]/20 text-[hsl(199,89%,65%)] border-[hsl(199,89%,48%)]/30 hover:bg-[hsl(199,89%,48%)]/30">
              <Anchor className="h-3 w-3 mr-1" /> Società Sportiva Dilettantistica
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Scopri la Vela sul <br />
              <span className="text-[hsl(199,89%,48%)]">Lago di Como</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              Corsi per tutti i livelli, regate internazionali e una passione 
              che dura da oltre 50 anni. Unisciti al Centro Vela Dervio.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/corsi">
                <Button size="lg" className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2">
                  <BookOpen className="h-5 w-5" /> Scopri i Corsi
                </Button>
              </Link>
              <Link href="/regate">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                  <Trophy className="h-5 w-5" /> Prossime Regate
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[hsl(199,89%,48%)] text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <Users className="h-8 w-8 mx-auto" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-white/80">Soci Attivi</div>
            </div>
            <div className="space-y-2">
              <Wind className="h-8 w-8 mx-auto" />
              <div className="text-3xl font-bold">30+</div>
              <div className="text-sm text-white/80">Imbarcazioni</div>
            </div>
            <div className="space-y-2">
              <Trophy className="h-8 w-8 mx-auto" />
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm text-white/80">Regate all'Anno</div>
            </div>
            <div className="space-y-2">
              <Calendar className="h-8 w-8 mx-auto" />
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-white/80">Anni di Attività</div>
            </div>
          </div>
        </div>
      </section>

      {/* Corsi Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(210,50%,20%)] mb-2">I Nostri Corsi</h2>
              <p className="text-slate-500">Dai principianti ai corsi agonistici, per ogni età e livello</p>
            </div>
            <Link href="/corsi">
              <Button variant="ghost" className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,40%)] gap-2">
                Vedi tutti i corsi <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses?.map((course) => (
              <Card key={course.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={course.image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <Badge className="bg-white/90 text-[hsl(210,50%,20%)]">{course.level}</Badge>
                    <span className="text-white font-bold">€{course.price}</span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-2">{course.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.short_description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.current_participants}/{course.max_participants}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {course.duration_days} giorni</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {course.category}</span>
                  </div>
                  <Link href={`/corsi/${course.slug}`}>
                    <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">
                      Dettagli Corso
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regate Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(210,50%,20%)] mb-2">Prossime Regate</h2>
              <p className="text-slate-500">Eventi e competizioni sul Lago di Como</p>
            </div>
            <Link href="/regate">
              <Button variant="ghost" className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,40%)] gap-2">
                Vedi tutte le regate <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regattas?.map((regatta) => (
              <Card key={regatta.id} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={regatta.image_url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800'}
                    alt={regatta.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-[hsl(199,89%,48%)] text-white">{regatta.status}</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-2">{regatta.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3">{regatta.short_description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(regatta.start_date).toLocaleDateString('it-IT')}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {regatta.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(210,50%,20%)] mb-2">Ultime News</h2>
              <p className="text-slate-500">Aggiornamenti e comunicazioni dal Centro Vela</p>
            </div>
            <Link href="/news">
              <Button variant="ghost" className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,40%)] gap-2">
                Vedi tutte le news <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems?.map((item, i) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image_url || 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800'}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      {item.featured && <Badge className="bg-amber-500 text-white text-xs">In evidenza</Badge>}
                    </div>
                    <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-2 group-hover:text-[hsl(199,89%,48%)] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{item.excerpt}</p>
                    <div className="mt-3 text-xs text-slate-400">
                      {item.published_at && new Date(item.published_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(210,50%,20%)] mb-2">Gallery</h2>
              <p className="text-slate-500">I momenti più belli del Centro Vela</p>
            </div>
            <Link href="/gallery">
              <Button variant="ghost" className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,40%)] gap-2">
                Vedi tutta la gallery <ImageIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {albums?.map((album) => (
              <Link key={album.id} href={`/gallery/${album.id}`} className="group relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={album.cover_image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-bold text-sm">{album.title}</h3>
                  <p className="text-white/70 text-xs">{album.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[hsl(210,50%,20%)] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920"
            alt="Sfondo"
            fill
            className="object-cover"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto per la Vela?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Iscriviti ai nostri corsi e vivi l'esperienza del Lago di Como. 
            Posti limitati per garantire la qualità dell'insegnamento.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/corsi">
              <Button size="lg" className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2">
                <BookOpen className="h-5 w-5" /> Iscriviti a un Corso
              </Button>
            </Link>
            <Link href="/contatti">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <MapPin className="h-5 w-5" /> Contattaci
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
