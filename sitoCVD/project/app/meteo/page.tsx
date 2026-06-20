import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudSun, Wind, Thermometer, Droplets, Eye, Gauge } from 'lucide-react';

export const metadata = {
  title: 'Meteo - Centro Vela Dervio',
  description: 'Condizioni meteo e vento sul Lago di Como in tempo reale.',
};

export default function MeteoPage() {
  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Meteo</h1>
          <p className="text-white/70">Condizioni meteo e vento in tempo reale sul Lago di Como</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Windy iframe */}
            <Card className="lg:col-span-2 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  width="100%"
                  height="500"
                  src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=11&overlay=wind&product=ecmwf&level=surface&lat=46.076&lon=9.306&detailLat=46.076&detailLon=9.306&marker=true"
                  frameBorder="0"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </CardContent>
            </Card>

            {/* Info sidebar */}
            <div className="space-y-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <h3 className="font-bold text-[hsl(210,50%,20%)] mb-4 flex items-center gap-2">
                    <Wind className="h-5 w-5 text-[hsl(199,89%,48%)]" /> Vento sul Lago
                  </h3>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Wind className="h-4 w-4 text-slate-400" /> Direzione</span>
                      <span className="font-medium">Variabile (Breva/Tivano)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Thermometer className="h-4 w-4 text-slate-400" /> Temperature</span>
                      <span className="font-medium">18-28°C estate</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Droplets className="h-4 w-4 text-slate-400" /> Acqua</span>
                      <span className="font-medium">20-24°C estate</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Eye className="h-4 w-4 text-slate-400" /> Visibilita</span>
                      <span className="font-medium">Buona</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2"><Gauge className="h-4 w-4 text-slate-400" /> Pressione</span>
                      <span className="font-medium">1013 hPa</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-5">
                  <h3 className="font-bold text-[hsl(210,50%,20%)] mb-3">I Venti del Lago di Como</h3>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div>
                      <Badge className="bg-[hsl(199,89%,48%)] text-white mb-1">Breva</Badge>
                      <p>Vento del sud che soffia dal pomeriggio fino a sera. E il vento termico tipico del lago, perfetto per la vela.</p>
                    </div>
                    <div>
                      <Badge className="bg-amber-500 text-white mb-1">Tivano</Badge>
                      <p>Vento del nord che soffia la mattina presto. Meno costante ma ideale per le prime uscite.</p>
                    </div>
                    <div>
                      <Badge className="bg-slate-500 text-white mb-1">Vent contort</Badge>
                      <p>Vento di fohn dal nord, molto forte e imprevedibile. Si verifica in autunno e inverno.</p>
                    </div>
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
