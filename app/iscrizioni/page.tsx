'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft, Loader2, Sun, Bed, Calendar, MapPin } from 'lucide-react';

type EnrollmentOption = 'day' | 'campus';

export default function IscrizioniPage() {
  const searchParams = useSearchParams();
  const preType = searchParams.get('type');
  const preId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState<'course' | 'regatta' | ''>(preType as any || '');
  const [selectedId, setSelectedId] = useState(preId || '');
  const [courses, setCourses] = useState<any[]>([]);
  const [regattas, setRegattas] = useState<any[]>([]);
  const [courseWeeks, setCourseWeeks] = useState<any[]>([]);
  const [selectedWeek, setSelectedWeek] = useState('');
  const [option, setOption] = useState<EnrollmentOption>('day');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', birth_date: '',
    address: '', city: '', zip_code: '', fiv_number: '',
    emergency_contact: '', emergency_phone: '', medical_notes: '', notes: ''
  });

  useEffect(() => {
    supabase.from('courses').select('id, title, price_day, price_campus, school_period, accommodation_type, meal_included, accommodation_included').eq('is_active', true).eq('registrations_open', true).then(({ data }) => setCourses(data ?? []));
    supabase.from('regattas').select('id, title').eq('status', 'upcoming').then(({ data }) => setRegattas(data ?? []));
  }, []);

  useEffect(() => {
    if (selectedId && type === 'course') {
      const course = courses.find(c => c.id === selectedId);
      setSelectedCourse(course || null);
      supabase.from('course_weeks').select('*').eq('course_id', selectedId).eq('is_active', true).order('week_number', { ascending: true }).then(({ data }) => {
        setCourseWeeks(data ?? []);
        if (data && data.length > 0) setSelectedWeek(data[0].id);
      });
    } else {
      setCourseWeeks([]);
      setSelectedWeek('');
      setSelectedCourse(null);
    }
  }, [selectedId, type, courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !selectedId) { toast.error('Seleziona un corso o una regata'); return; }
    if (type === 'course' && !selectedWeek) { toast.error('Seleziona una settimana'); return; }
    setLoading(true);
    const payload = {
      ...form,
      [type === 'course' ? 'course_id' : 'regatta_id']: selectedId,
      option: type === 'course' ? option : null,
      week_id: type === 'course' ? selectedWeek : null,
    };
    const { error } = await supabase.from('enrollments').insert(payload);
    setLoading(false);
    if (error) { toast.error('Errore durante l\'iscrizione: ' + error.message); }
    else { setSuccess(true); toast.success('Iscrizione inviata con successo!'); }
  };

  const price = selectedCourse ? (option === 'day' ? selectedCourse.price_day : selectedCourse.price_campus) : 0;

  if (success) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <CheckCircle className="h-20 w-20 mx-auto text-[hsl(165,55%,50%)] mb-6" />
          <h1 className="text-3xl font-bold text-[hsl(210,50%,20%)] mb-4">Iscrizione Completata!</h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Grazie per la tua iscrizione. Ti contatteremo presto per confermare i dettagli.</p>
          <Link href="/">
            <Button className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">Torna alla Home</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Link href="/">
            <Button variant="ghost" className="text-white mb-4 hover:bg-white/20 gap-2"><ArrowLeft className="h-4 w-4" /> Indietro</Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">Iscrizione</h1>
          <p className="text-white/70 mt-2">Scegli il corso, la settimana e l'opzione diurno o campus.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Select type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Tipo di iscrizione</Label>
                      <Select value={type} onValueChange={(v) => { setType(v as any); setSelectedId(''); }}>
                        <SelectTrigger><SelectValue placeholder="Seleziona..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="course">Corso di Vela</SelectItem>
                          <SelectItem value="regatta">Regata</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{type === 'course' ? 'Corso' : type === 'regatta' ? 'Regata' : 'Seleziona tipo'}</Label>
                      <Select value={selectedId} onValueChange={setSelectedId} disabled={!type}>
                        <SelectTrigger><SelectValue placeholder={type ? 'Seleziona...' : 'Scegli tipo prima'} /></SelectTrigger>
                        <SelectContent>
                          {type === 'course' && courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                          {type === 'regatta' && regattas.map(r => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Step 2: Select option (diurno/campus) for courses */}
                  {type === 'course' && selectedCourse && (
                    <div className="space-y-4">
                      <Label>Scegli l'opzione</Label>
                      <RadioGroup value={option} onValueChange={(v) => setOption(v as EnrollmentOption)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className={`cursor-pointer border-2 transition-all ${option === 'day' ? 'border-amber-500 bg-amber-50' : 'border-transparent'}`}>
                          <CardContent className="p-4 flex items-center gap-3">
                            <RadioGroupItem value="day" id="day" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Sun className="h-5 w-5 text-amber-500" />
                                <Label htmlFor="day" className="font-bold cursor-pointer">Corso Diurno</Label>
                              </div>
                              <div className="text-sm text-slate-500 mt-1">Solo ore di vela (9:00-16:00)</div>
                              <div className="text-lg font-bold text-amber-600 mt-1">€{selectedCourse.price_day}/settimana</div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className={`cursor-pointer border-2 transition-all ${option === 'campus' ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/5' : 'border-transparent'}`}>
                          <CardContent className="p-4 flex items-center gap-3">
                            <RadioGroupItem value="campus" id="campus" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Bed className="h-5 w-5 text-[hsl(199,89%,48%)]" />
                                <Label htmlFor="campus" className="font-bold cursor-pointer">Campus</Label>
                                <span className="text-xs bg-[hsl(199,89%,48%)] text-white px-2 py-0.5 rounded">Consigliato</span>
                              </div>
                              <div className="text-sm text-slate-500 mt-1">Alloggio + pasti + attività serali</div>
                              <div className="text-lg font-bold text-[hsl(199,89%,48%)] mt-1">€{selectedCourse.price_campus}/settimana</div>
                            </div>
                          </CardContent>
                        </Card>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Step 3: Select week for courses */}
                  {type === 'course' && courseWeeks.length > 0 && (
                    <div className="space-y-2">
                      <Label>Seleziona settimana</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {courseWeeks.map((w) => (
                          <div
                            key={w.id}
                            onClick={() => setSelectedWeek(w.id)}
                            className={`cursor-pointer rounded-lg border-2 p-3 transition-all ${
                              selectedWeek === w.id ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/5' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="font-bold text-sm text-[hsl(210,50%,20%)]">Settimana {w.week_number}</div>
                            <div className="text-xs text-slate-400 mt-1">
                              {new Date(w.start_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} -
                              {new Date(w.end_date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                            </div>
                            <div className={`text-xs mt-1 ${w.spots_booked < w.spots_total ? 'text-emerald-500' : 'text-red-500'}`}>
                              {w.spots_booked < w.spots_total ? `${w.spots_total - w.spots_booked} posti` : 'Esaurito'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price summary */}
                  {type === 'course' && selectedCourse && selectedWeek && (
                    <Card className="bg-slate-50 border-0">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-slate-500">Totale da pagare</div>
                            <div className="text-2xl font-bold text-[hsl(199,89%,48%)]">€{price}</div>
                          </div>
                          <div className="text-right text-sm text-slate-500">
                            <div>{selectedCourse.title}</div>
                            <div>{option === 'day' ? 'Corso Diurno' : 'Campus'}</div>
                            <div>Settimana {courseWeeks.find(w => w.id === selectedWeek)?.week_number}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Personal data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="first_name">Nome *</Label><Input id="first_name" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="last_name">Cognome *</Label><Input id="last_name" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="phone">Telefono</Label><Input id="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="birth_date">Data di nascita</Label><Input id="birth_date" type="date" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="fiv_number">Numero FIV</Label><Input id="fiv_number" value={form.fiv_number} onChange={e => setForm({...form, fiv_number: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="address">Indirizzo</Label><Input id="address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="city">Citta</Label><Input id="city" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="zip_code">CAP</Label><Input id="zip_code" value={form.zip_code} onChange={e => setForm({...form, zip_code: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="emergency_contact">Contatto emergenza</Label><Input id="emergency_contact" value={form.emergency_contact} onChange={e => setForm({...form, emergency_contact: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="emergency_phone">Tel. emergenza</Label><Input id="emergency_phone" value={form.emergency_phone} onChange={e => setForm({...form, emergency_phone: e.target.value})} /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="medical_notes">Note mediche</Label><Textarea id="medical_notes" value={form.medical_notes} onChange={e => setForm({...form, medical_notes: e.target.value})} /></div>
                  <div className="space-y-2"><Label htmlFor="notes">Note</Label><Textarea id="notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
                  <Button type="submit" className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white" disabled={loading}>
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Invio...</> : 'Invia Iscrizione'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
