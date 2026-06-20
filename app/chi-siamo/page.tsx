import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Anchor, Award, Heart, Users, Wind, MapPin, Calendar, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Chi Siamo - Centro Vela Dervio',
  description: 'Scopri la storia del Centro Vela Dervio, la nostra missione, i valori e il team.',
};

const team = [
  { name: 'Marco Bianchi', role: 'Direttore Sportivo', desc: 'Istruttore FIV dal 1995, ex agonista Optimist e Laser.' },
  { name: 'Laura Rossi', role: 'Istruttore Laser', desc: 'Specialista Laser Radial e Standard, allenatrice regionale.' },
  { name: 'Giuseppe Verdi', role: 'Istruttore Derive', desc: 'Esperto di derive leggere, istruttore dal 2008.' },
  { name: 'Anna Neri', role: 'Istruttore 420', desc: 'Ex campionessa italiana 420, allenatrice di equipaggi.' },
  { name: 'Roberto Marini', role: 'Istruttore Agonistico', desc: 'Ex atleta skiff, preparatore fisico e tecnico.' },
  { name: 'Elena Gialli', role: 'Istruttore Bambini', desc: 'Specialista vela giocata, pedagogista sportiva.' },
];

const values = [
  { icon: Heart, title: 'Passione', desc: 'La vela è la nostra passione, condividiamola con tutti.' },
  { icon: Award, title: 'Eccellenza', desc: 'Istruttori qualificati e programmi certificati FIV.' },
  { icon: Users, title: 'Comunità', desc: 'Un ambiente accogliente per tutti, soci e non.' },
  { icon: Wind, title: 'Natura', desc: 'Rispetto per il lago e l\'ambiente che ci ospita.' },
];

export default function ChiSiamoPage() {
  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920" alt="" fill className="object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Chi Siamo</h1>
          <p className="text-white/70 max-w-2xl">La storia, la missione e il team del Centro Vela Dervio.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800" alt="Centro Vela Dervio" fill className="object-cover" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-[hsl(210,50%,20%)]">La Nostra Storia</h2>
              <p className="text-slate-600 leading-relaxed">Fondato nel 1975, il Centro Vela Dervio è una delle società sportive più storiche del Lago di Como. Da oltre 50 anni promuoviamo la vela e la cultura nautica, formando migliaia di velisti e organizzando competizioni di livello nazionale e internazionale.</p>
              <p className="text-slate-600 leading-relaxed">La nostra base si trova a Dervio, in una delle zone più ventose del lago, ideale per la pratica della vela in tutte le classi. Disponiamo di un'ampia flotta, spogliatoi, uffici e una terrazza panoramica sul lago.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-slate-600"><CheckCircle className="h-5 w-5 text-[hsl(199,89%,48%)]" /> <span>Scuola FIV riconosciuta</span></div>
                <div className="flex items-center gap-2 text-slate-600"><CheckCircle className="h-5 w-5 text-[hsl(199,89%,48%)]" /> <span>30+ imbarcazioni</span></div>
                <div className="flex items-center gap-2 text-slate-600"><CheckCircle className="h-5 w-5 text-[hsl(199,89%,48%)]" /> <span>6 istruttori qualificati</span></div>
                <div className="flex items-center gap-2 text-slate-600"><CheckCircle className="h-5 w-5 text-[hsl(199,89%,48%)]" /> <span>500+ soci attivi</span></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {values.map((v) => (
              <Card key={v.title} className="border-0 shadow-lg hover:shadow-xl transition-all text-center p-6">
                <v.icon className="h-10 w-10 mx-auto mb-4 text-[hsl(199,89%,48%)]" />
                <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500">{v.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[hsl(210,50%,20%)] text-center mb-12">Il Nostro Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <Card key={member.name} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-[hsl(199,89%,48%)]/10 flex items-center justify-center mx-auto mb-4">
                      <Anchor className="h-8 w-8 text-[hsl(199,89%,48%)]" />
                    </div>
                    <h3 className="text-lg font-bold text-[hsl(210,50%,20%)]">{member.name}</h3>
                    <p className="text-sm text-[hsl(199,89%,48%)] font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-slate-500">{member.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
