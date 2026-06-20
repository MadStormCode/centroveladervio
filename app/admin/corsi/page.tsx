'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

export default function AdminCorsi() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (item: any) => {
    setEditing(item);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '', slug: '', description: '', short_description: '', level: 'principiante', category: 'optimist',
      age_min: 6, age_max: 99, price: 0, max_participants: 10, duration_days: 10,
      period_start: '', period_end: '', schedule_description: '', instructor: '',
      image_url: '', is_active: true, registrations_open: true
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Compila titolo e slug'); return; }
    const payload = { ...form };
    if (editing) {
      const { error } = await supabase.from('courses').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Corso aggiornato');
    } else {
      const { error } = await supabase.from('courses').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Corso creato');
    }
    setDialogOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminare questo corso?')) return;
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Corso eliminato');
    load();
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
              <TableHead>Prezzo</TableHead>
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
                <TableCell>€{item.price}</TableCell>
                <TableCell>{item.current_participants}/{item.max_participants}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge className={item.is_active ? 'bg-emerald-500' : 'bg-slate-400'}>{item.is_active ? 'Attivo' : 'Inattivo'}</Badge>
                    <Badge className={item.registrations_open ? 'bg-blue-500' : 'bg-slate-400'}>{item.registrations_open ? 'Iscrizioni aperte' : 'Chiuse'}</Badge>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? 'Modifica Corso' : 'Nuovo Corso'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
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
            <div className="space-y-2"><Label>Età min</Label><Input type="number" value={form.age_min || 6} onChange={e => setForm({...form, age_min: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Età max</Label><Input type="number" value={form.age_max || 99} onChange={e => setForm({...form, age_max: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Prezzo</Label><Input type="number" value={form.price || 0} onChange={e => setForm({...form, price: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Max partecipanti</Label><Input type="number" value={form.max_participants || 10} onChange={e => setForm({...form, max_participants: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Durata (giorni)</Label><Input type="number" value={form.duration_days || 10} onChange={e => setForm({...form, duration_days: Number(e.target.value)})} /></div>
            <div className="space-y-2"><Label>Periodo inizio</Label><Input type="date" value={form.period_start || ''} onChange={e => setForm({...form, period_start: e.target.value})} /></div>
            <div className="space-y-2"><Label>Periodo fine</Label><Input type="date" value={form.period_end || ''} onChange={e => setForm({...form, period_end: e.target.value})} /></div>
            <div className="space-y-2"><Label>Orario</Label><Input value={form.schedule_description || ''} onChange={e => setForm({...form, schedule_description: e.target.value})} /></div>
            <div className="space-y-2"><Label>Istruttore</Label><Input value={form.instructor || ''} onChange={e => setForm({...form, instructor: e.target.value})} /></div>
            <div className="space-y-2"><Label>Immagine URL</Label><Input value={form.image_url || ''} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
            <div className="flex items-center gap-2"><Label>Attivo</Label><Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} /></div>
            <div className="flex items-center gap-2"><Label>Iscrizioni aperte</Label><Switch checked={form.registrations_open} onCheckedChange={v => setForm({...form, registrations_open: v})} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Annulla</Button>
            <Button onClick={save} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white">Salva</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
