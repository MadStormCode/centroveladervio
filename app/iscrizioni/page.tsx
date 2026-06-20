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
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';

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
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '', birth_date: '',
    address: '', city: '', zip_code: '', fiv_number: '',
    emergency_contact: '', emergency_phone: '', medical_notes: '', notes: ''
  });

  useEffect(() => {
    supabase.from('courses').select('id, title').eq('is_active', true).eq('registrations_open', true).then(({ data }) => setCourses(data ?? []));
    supabase.from('regattas').select('id, title').eq('status', 'upcoming').then(({ data }) => setRegattas(data ?? []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !selectedId) { toast.error('Seleziona un corso o una regata'); return; }
    setLoading(true);
    const payload = { ...form, [type === 'course' ? 'course_id' : 'regatta_id']: selectedId };
    const { error } = await supabase.from('enrollments').insert(payload);
    setLoading(false);
    if (error) { toast.error('Errore durante l\'iscrizione: ' + error.message); }
    else { setSuccess(true); toast.success('Iscrizione inviata con successo!'); }
  };

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
          <p className="text-white/70 mt-2">Compila il modulo per iscriverti a un corso o a una regata.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="first_name">Nome *</Label><Input id="first_name" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="last_name">Cognome *</Label><Input id="last_name" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="phone">Telefono</Label><Input id="phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="birth_date">Data di nascita</Label><Input id="birth_date" type="date" value={form.birth_date} onChange={e => setForm({...form, birth_date: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="fiv_number">Numero FIV</Label><Input id="fiv_number" value={form.fiv_number} onChange={e => setForm({...form, fiv_number: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="address">Indirizzo</Label><Input id="address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
                    <div className="space-y-2"><Label htmlFor="city">Città</Label><Input id="city" value={form.city} onChange={e => setForm({...form, city: e.target.value})} /></div>
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
