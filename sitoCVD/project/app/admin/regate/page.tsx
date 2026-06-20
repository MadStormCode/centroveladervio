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
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

export default function AdminRegate() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    const { data } = await supabase.from('regattas').select('*').order('start_date', { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (item: any) => { setEditing(item); setForm({ ...item }); setDialogOpen(true); };
  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', description: '', short_description: '', location: '', start_date: '', end_date: '', registration_deadline: '', status: 'upcoming', is_public: true, image_url: '' });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Compila titolo e slug'); return; }
    const payload = { ...form };
    if (editing) {
      const { error } = await supabase.from('regattas').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Regata aggiornata');
    } else {
      const { error } = await supabase.from('regattas').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Regata creata');
    }
    setDialogOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminare?')) return;
    const { error } = await supabase.from('regattas').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Eliminata'); load();
  };

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const statusColor: Record<string, string> = { upcoming: 'bg-blue-500', ongoing: 'bg-amber-500', completed: 'bg-emerald-500', cancelled: 'bg-red-500' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Gestione Regate</h1>
        <Button onClick={openCreate} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2"><Plus className="h-4 w-4" /> Nuova Regata</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input className="pl-10" placeholder="Cerca..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Titolo</TableHead><TableHead>Data</TableHead><TableHead>Stato</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{new Date(item.start_date).toLocaleDateString('it-IT')}</TableCell>
                <TableCell><Badge className={statusColor[item.status] || 'bg-slate-400'}>{item.status}</Badge></TableCell>
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
          <DialogHeader><DialogTitle>{editing ? 'Modifica Regata' : 'Nuova Regata'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Titolo</Label><Input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value})} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Descrizione</Label><Textarea rows={3} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Descrizione breve</Label><Input value={form.short_description || ''} onChange={e => setForm({...form, short_description: e.target.value})} /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} /></div>
            <div className="space-y-2"><Label>Data inizio</Label><Input type="date" value={form.start_date || ''} onChange={e => setForm({...form, start_date: e.target.value})} /></div>
            <div className="space-y-2"><Label>Data fine</Label><Input type="date" value={form.end_date || ''} onChange={e => setForm({...form, end_date: e.target.value})} /></div>
            <div className="space-y-2"><Label>Scadenza iscrizioni</Label><Input type="date" value={form.registration_deadline || ''} onChange={e => setForm({...form, registration_deadline: e.target.value})} /></div>
            <div className="space-y-2"><Label>Stato</Label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.status || 'upcoming'} onChange={e => setForm({...form, status: e.target.value})}>
                <option>upcoming</option><option>ongoing</option><option>completed</option><option>cancelled</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Immagine URL</Label><Input value={form.image_url || ''} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
            <div className="space-y-2"><Label>Bando PDF URL</Label><Input value={form.notice_of_race_url || ''} onChange={e => setForm({...form, notice_of_race_url: e.target.value})} /></div>
            <div className="space-y-2"><Label>Istruzioni PDF URL</Label><Input value={form.sailing_instructions_url || ''} onChange={e => setForm({...form, sailing_instructions_url: e.target.value})} /></div>
            <div className="space-y-2"><Label>Risultati PDF URL</Label><Input value={form.results_url || ''} onChange={e => setForm({...form, results_url: e.target.value})} /></div>
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
