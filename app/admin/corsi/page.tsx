'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Search, X } from 'lucide-react';

export default function AdminCorsi() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});
  const [weeks, setWeeks] = useState<any[]>([]);
  const [weekDialog, setWeekDialog] = useState(false);
  const [weekForm, setWeekForm] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'general' | 'weeks'>('general');

  const load = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const loadWeeks = async (courseId: string) => {
    const { data } = await supabase.from('course_weeks').select('*').eq('course_id', courseId).order('week_number', { ascending: true });
    setWeeks(data ?? []);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item });
    setActiveTab('general');
    setWeeks([]);
    loadWeeks(item.id);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '', slug: '', description: '', short_description: '', level: 'principiante', category: 'optimist',
      age_min: 6, age_max: 99, price: 0, price_day: 0, price_campus: 0, max_participants: 10, duration_days: 10,
      period_start: '', period_end: '', school_period: '', schedule_description: '', day_schedule: 'Lun-Sab 9:00-16:00',
      campus_schedule: 'Dom-Sab 8:00-19:00', instructor: '', image_url: '', gear_included: '', what_to_bring: '',
      daily_program: '', highlights: [], is_active: true, registrations_open: true,
      accommodation_type: 'campus', meal_included: true, accommodation_included: true
    });
    setWeeks([]);
    setActiveTab('general');
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Compila titolo e slug'); return; }
    const payload = { ...form };
    if (payload.week_start_dates && typeof payload.week_start_dates === 'string') {
      try { payload.week_start_dates = JSON.parse(payload.week_start_dates); } catch { }
    }
    if (payload.highlights && typeof payload.highlights === 'string') {
      try { payload.highlights = JSON.parse(payload.highlights); } catch { payload.highlights = payload.highlights.split(',').map((s: string) => s.trim()); }
    }
    if (editing) {
      const { error } = await supabase.from('courses').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Corso aggiornato');
    } else {
      const { data, error } = await supabase.from('courses').insert(payload).select().single();
      if (error) { toast.error(error.message); return; }
      toast.success('Corso creato');
      setEditing(data);
      loadWeeks(data.id);
    }
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo corso?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Corso eliminato');
    load();
  };

  const saveWeek = async () => {
    if (!editing) return;
    const payload = { ...weekForm, course_id: editing.id };
    if (weekForm.id) {
      const { error } = await supabase.from('course_weeks').update(payload).eq('id', weekForm.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Settimana aggiornata');
    } else {
      const { error } = await supabase.from('course_weeks').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Settimana creata');
    }
    setWeekDialog(false);
    loadWeeks(editing.id);
  };

  const removeWeek = async (id: string) => {
    if (!confirm('Eliminare questa settimana?')) return;
    const { error } = await supabase.from('course_weeks').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Settimana eliminata');
    if (editing) loadWeeks(editing.id);
  };

  const openWeekEdit = (week: any) => {
    setWeekForm({ ...week });
    setWeekDialog(true);
  };

  const openWeekCreate = () => {
    const nextNum = weeks.length + 1;
    setWeekForm({
      week_number: nextNum, start_date: '', end_date: '',
      price_day: form.price_day || 0, price_campus: form.price_campus || 0,
      spots_total: form.max_participants || 10, spots_booked: 0, is_active: true, notes: ''
    });
    setWeekDialog(true);
  };

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Gestione Corsi</h1>
        <Button onClick={openCreate} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2"><Plus className="h-4 w-4" /> Nuovo Corso</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input className="pl-10" placeholder="Cerca corso..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titolo</TableHead>
              <TableHead>Livello</TableHead>
              <TableHead>Prezzo Diurno</TableHead>
              <TableHead>Prezzo Campus</TableHead>
              <TableHead>Posti</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell><Badge variant="outline">{item.level}</Badge></TableCell>
                <TableCell>€{item.price_day}</TableCell>
                <TableCell>€{item.price_campus}</TableCell>
                <TableCell>{item.current_participants}/{item.max_participants}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={item.is_active ? 'bg-emerald-500' : 'bg-slate-400'}>{item.is_active ? 'Attivo' : 'Inattivo'}</Badge>
                    <Badge className={item.registrations_open ? 'bg-blue-500' : 'bg-slate-400'}>{item.registrations_open ? 'Aperte' : 'Chiuse'}</Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Main dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Modifica Corso' : 'Nuovo Corso'}</DialogTitle></DialogHeader>
          <div className="flex gap-2 mb-4">
            <Button size="sm" variant={activeTab === 'general' ? 'default' : 'outline'} onClick={() => setActiveTab('general')}>Generale</Button>
            <Button size="sm" variant={activeTab === 'weeks' ? 'default' : 'outline'} onClick={() => setActiveTab('weeks')} disabled={!editing}>Settimane ({weeks.length})</Button>
          </div>

          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Titolo</Label><Input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} /></div>
                <div className="space-y-2"><Label>Slug</Label><Input value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value})} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Descrizione</Label><Textarea rows={3} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Descrizione breve</Label><Input value={form.short_description || ''} onChange={e => setForm({...form, short_description: e.target.value})} /></div>
                <div className="space-y-2"><Label>Livello</Label>
                  <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.level || 'principiante'} onChange={e => setForm({...form, level: e.target.value})}>
                    <option>principiante</option><option>intermedio</option><option>avanzato</option><option>agonistico</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Categoria</Label>
                  <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.category || 'optimist'} onChange={e => setForm({...form, category: e.target.value})}>
                    <option>optimist</option><option>laser</option><option>420</option><option>skiff</option><option>adulti</option><option>bambini</option><option>deriva</option><option>crociera</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Periodo scuola</Label><Input value={form.school_period || ''} onChange={e => setForm({...form, school_period: e.target.value})} placeholder="15 Giugno - 14 Agosto" /></div>
                <div className="space-y-2"><Label>Numero settimane</Label><Input type="number" value={form.weeks_count || 1} onChange={e => setForm({...form, weeks_count: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Prezzo Diurno (€/settimana)</Label><Input type="number" value={form.price_day || 0} onChange={e => setForm({...form, price_day: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Prezzo Campus (€/settimana)</Label><Input type="number" value={form.price_campus || 0} onChange={e => setForm({...form, price_campus: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Età min</Label><Input type="number" value={form.age_min || 6} onChange={e => setForm({...form, age_min: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Età max</Label><Input type="number" value={form.age_max || 99} onChange={e => setForm({...form, age_max: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Max partecipanti</Label><Input type="number" value={form.max_participants || 10} onChange={e => setForm({...form, max_participants: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Durata (giorni)</Label><Input type="number" value={form.duration_days || 10} onChange={e => setForm({...form, duration_days: Number(e.target.value)})} /></div>
                <div className="space-y-2"><Label>Orario Diurno</Label><Input value={form.day_schedule || ''} onChange={e => setForm({...form, day_schedule: e.target.value})} /></div>
                <div className="space-y-2"><Label>Orario Campus</Label><Input value={form.campus_schedule || ''} onChange={e => setForm({...form, campus_schedule: e.target.value})} /></div>
                <div className="space-y-2"><Label>Istruttore</Label><Input value={form.instructor || ''} onChange={e => setForm({...form, instructor: e.target.value})} /></div>
                <div className="space-y-2"><Label>Immagine URL</Label><Input value={form.image_url || ''} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
                <div className="space-y-2"><Label>Attrezzatura inclusa</Label><Input value={form.gear_included || ''} onChange={e => setForm({...form, gear_included: e.target.value})} /></div>
                <div className="space-y-2"><Label>Cosa portare</Label><Input value={form.what_to_bring || ''} onChange={e => setForm({...form, what_to_bring: e.target.value})} /></div>
                <div className="space-y-2 md:col-span-2"><Label>Programma giornaliero (una riga per orario)</Label><Textarea rows={5} value={form.daily_program || ''} onChange={e => setForm({...form, daily_program: e.target.value})} placeholder="08:00 - Colazione\n09:00 - Teoria..." /></div>
                <div className="space-y-2 md:col-span-2"><Label>Highlights (separati da virgola)</Label><Input value={Array.isArray(form.highlights) ? form.highlights.join(', ') : form.highlights || ''} onChange={e => setForm({...form, highlights: e.target.value})} /></div>
                <div className="flex items-center gap-2"><Label>Attivo</Label><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /></div>
                <div className="flex items-center gap-2"><Label>Iscrizioni aperte</Label><Switch checked={form.registrations_open} onCheckedChange={v => setForm({...form, registrations_open: v})} /></div>
                <div className="flex items-center gap-2"><Label>Pasti inclusi</Label><Switch checked={form.meal_included} onCheckedChange={v => setForm({...form, meal_included: v})} /></div>
                <div className="flex items-center gap-2"><Label>Alloggio incluso</Label><Switch checked={form.accommodation_included} onCheckedChange={v => setForm({...form, accommodation_included: v})} /></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Annulla</Button>
                <Button onClick={save} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">Salva Corso</Button>
              </div>
            </div>
          )}

          {activeTab === 'weeks' && editing && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[hsl(210,50%,20%)]">Settimane del corso</h3>
                <Button onClick={openWeekCreate} size="sm" className="bg-[hsl(199,89%,48%)] text-white gap-1"><Plus className="h-3 w-3" /> Aggiungi</Button>
              </div>
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>N.</TableHead><TableHead>Data</TableHead><TableHead>Prezzo Giorno</TableHead><TableHead>Prezzo Campus</TableHead><TableHead>Posti</TableHead><TableHead>Stato</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeks.map(w => (
                      <TableRow key={w.id}>
                        <TableCell className="font-medium">{w.week_number}</TableCell>
                        <TableCell>{w.start_date} / {w.end_date}</TableCell>
                        <TableCell>€{w.price_day}</TableCell>
                        <TableCell>€{w.price_campus}</TableCell>
                        <TableCell>{w.spots_booked}/{w.spots_total}</TableCell>
                        <TableCell><Badge className={w.is_active ? 'bg-emerald-500' : 'bg-slate-400'}>{w.is_active ? 'Attiva' : 'Inattiva'}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openWeekEdit(w)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => removeWeek(w.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Week dialog */}
      <Dialog open={weekDialog} onOpenChange={setWeekDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{weekForm.id ? 'Modifica Settimana' : 'Nuova Settimana'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Numero</Label><Input type="number" value={weekForm.week_number || ''} onChange={e => setWeekForm({...weekForm, week_number: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Data inizio</Label><Input type="date" value={weekForm.start_date || ''} onChange={e => setWeekForm({...weekForm, start_date: e.target.value})} /></div>
            <div className="space-y-2"><Label>Data fine</Label><Input type="date" value={weekForm.end_date || ''} onChange={e => setWeekForm({...weekForm, end_date: e.target.value})} /></div>
            <div className="space-y-2"><Label>Prezzo Diurno</Label><Input type="number" value={weekForm.price_day || 0} onChange={e => setWeekForm({...weekForm, price_day: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Prezzo Campus</Label><Input type="number" value={weekForm.price_campus || 0} onChange={e => setWeekForm({...weekForm, price_campus: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Posti totali</Label><Input type="number" value={weekForm.spots_total || 10} onChange={e => setWeekForm({...weekForm, spots_total: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Posti prenotati</Label><Input type="number" value={weekForm.spots_booked || 0} onChange={e => setWeekForm({...weekForm, spots_booked: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Note</Label><Input value={weekForm.notes || ''} onChange={e => setWeekForm({...weekForm, notes: e.target.value})} /></div>
            <div className="flex items-center gap-2"><Label>Attiva</Label><Switch checked={weekForm.is_active} onCheckedChange={v => setWeekForm({...weekForm, is_active: v})} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setWeekDialog(false)}>Annulla</Button>
            <Button onClick={saveWeek} className="bg-[hsl(199,89%,48%)] text-white">Salva</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
