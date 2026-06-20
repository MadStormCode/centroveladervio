import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, MapPin, FileText, ArrowLeft, Trophy, Download } from 'lucide-react';

export const revalidate = 60;

async function getRegatta(slug: string) {
  const { data } = await supabase.from('regattas').select('*').eq('slug', slug).single();
  return data;
}

async function getResults(regattaId: string) {
  const { data } = await supabase.from('regatta_results').select('*').eq('regatta_id', regattaId).order('position', { ascending: true });
  return data ?? [];
}

const statusLabels: Record<string, string> = { upcoming: 'In programma', ongoing: 'In corso', completed: 'Completata', cancelled: 'Annullata' };

export default async function RegattaDetailPage({ params }: { params: { slug: string } }) {
  const regatta = await getRegatta(params.slug);
  if (!regatta) return notFound();
  const results = await getResults(regatta.id);

  return (
    <>
      <section className="relative h-80 overflow-hidden">
        <Image src={regatta.image_url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920'} alt={regatta.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto px-4 lg:px-8">
            <Link href="/regate">
              <Button variant="ghost" className="text-white mb-4 hover:bg-white/20 gap-2"><ArrowLeft className="h-4 w-4" /> Torna alle regate</Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{regatta.title}</h1>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[hsl(199,89%,48%)] text-white">{statusLabels[regatta.status]}</Badge>
                <Badge variant="outline">{regatta.location}</Badge>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4">Descrizione</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{regatta.description}</p>
              </div>

              {results.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2"><Trophy className="h-6 w-6 text-[hsl(199,89%,48%)]" /> Risultati</h2>
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Pos</TableHead>
                            <TableHead>Equipaggio / Atleta</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Barca</TableHead>
                            <TableHead className="text-right">Punti</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.map((r) => (
                            <TableRow key={r.id}>
                              <TableCell className="font-bold">{r.position}</TableCell>
                              <TableCell>{r.team_name || r.sailor_name}</TableCell>
                              <TableCell>{r.category}</TableCell>
                              <TableCell>{r.boat_number}</TableCell>
                              <TableCell className="text-right">{r.points}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-xl sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Stato</div>
                    <div className="text-xl font-bold text-[hsl(199,89%,48%)]">{statusLabels[regatta.status]}</div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[hsl(199,89%,48%)]" /> <span>{new Date(regatta.start_date).toLocaleDateString('it-IT')} {regatta.end_date && `- ${new Date(regatta.end_date).toLocaleDateString('it-IT')}`}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[hsl(199,89%,48%)]" /> <span>{regatta.location}</span></div>
                    {regatta.registration_deadline && (
                      <div className="flex items-center gap-2 text-amber-600"><FileText className="h-4 w-4" /> <span>Scadenza iscrizioni: {new Date(regatta.registration_deadline).toLocaleDateString('it-IT')}</span></div>
                    )}
                  </div>
                  {regatta.status === 'upcoming' && (
                    <Link href={`/iscrizioni?type=regatta&id=${regatta.id}`}>
                      <Button className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white mt-2">Iscriviti alla Regata</Button>
                    </Link>
                  )}
                  {regatta.notice_of_race_url && (
                    <Link href={regatta.notice_of_race_url} target="_blank">
                      <Button variant="outline" className="w-full gap-2"><Download className="h-4 w-4" /> Bando di Regata</Button>
                    </Link>
                  )}
                  {regatta.sailing_instructions_url && (
                    <Link href={regatta.sailing_instructions_url} target="_blank">
                      <Button variant="outline" className="w-full gap-2"><Download className="h-4 w-4" /> Istruzioni di Regata</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
