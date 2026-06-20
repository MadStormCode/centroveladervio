import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube } from 'lucide-react';

export const metadata = {
  title: 'Contatti - Centro Vela Dervio',
  description: 'Contatta il Centro Vela Dervio per informazioni, iscrizioni e collaborazioni.',
};

export default function ContattiPage() {
  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Contatti</h1>
          <p className="text-white/70 max-w-2xl">Siamo qui per aiutarti. Contattaci per informazioni su corsi, regate, iscrizioni o collaborazioni.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[hsl(210,50%,20%)] mb-6">Inviaci un Messaggio</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome e Cognome</Label>
                    <Input id="name" placeholder="Mario Rossi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="mario@esempio.it" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Oggetto</Label>
                  <Input id="subject" placeholder="Informazioni corso..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Messaggio</Label>
                  <Textarea id="message" placeholder="Scrivi il tuo messaggio..." rows={6} />
                </div>
                <Button type="submit" className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2">
                  <Send className="h-4 w-4" /> Invia Messaggio
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-[hsl(210,50%,20%)]">Informazioni</h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[hsl(199,89%,48%)] mt-0.5" />
                    <div>
                      <div className="font-medium">Indirizzo</div>
                      <div className="text-sm text-slate-500">Via Lungolago, 1<br />23824 Dervio (LC)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[hsl(199,89%,48%)] mt-0.5" />
                    <div>
                      <div className="font-medium">Telefono</div>
                      <div className="text-sm text-slate-500">+39 0341 123456</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[hsl(199,89%,48%)] mt-0.5" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-sm text-slate-500">info@centroveladervio.it</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[hsl(199,89%,48%)] mt-0.5" />
                    <div>
                      <div className="font-medium">Orari</div>
                      <div className="text-sm text-slate-500">Lun-Ven: 9:00 - 18:00<br />Sab-Dom: 9:00 - 13:00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-[hsl(210,50%,20%)] mb-4">Social</h3>
                  <div className="flex gap-3">
                    <a href="https://facebook.com/centroveladervio" target="_blank" className="p-3 rounded-full bg-[hsl(199,89%,48%)]/10 hover:bg-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)] hover:text-white transition-all"><Facebook className="h-5 w-5" /></a>
                    <a href="https://instagram.com/centroveladervio" target="_blank" className="p-3 rounded-full bg-[hsl(199,89%,48%)]/10 hover:bg-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)] hover:text-white transition-all"><Instagram className="h-5 w-5" /></a>
                    <a href="https://youtube.com/centroveladervio" target="_blank" className="p-3 rounded-full bg-[hsl(199,89%,48%)]/10 hover:bg-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)] hover:text-white transition-all"><Youtube className="h-5 w-5" /></a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="h-96 bg-slate-100">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2775.5!2d9.3!3d46.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786e0e0e0e0e0e0%3A0x0!2sDervio!5e0!3m2!1sit!2sit!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
