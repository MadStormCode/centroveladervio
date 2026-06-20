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
import { Pencil, Trash2, Plus, Search } from 'lucide-react';

export default function AdminNews() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (item: any) => { setEditing(item); setForm({ ...item }); setDialogOpen(true); };
  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', slug: '', content: '', excerpt: '', category: 'generale', status: 'draft', featured: false, image_url: '' });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.slug) { toast.error('Compila titolo e slug'); return; }
    const payload = { ...form };
    if (payload.status === 'published' && !payload.published_at) payload.published_at = new Date().toISOString();
    if (editing) {
      const { error } = await supabase.from('news').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('News aggiornata');
    } else {
      const { error } = await supabase.from('news').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('News creata');
    }
    setDialogOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminare?')) return;
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Eliminata'); load();
  };

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
  const statusColors: Record<string, string> = { draft: 'bg-slate-500', published: 'bg-emerald-500', archived: 'bg-slate-400' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Gestione News</h1>
        <Button onClick={openCreate} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2"><Plus className="h-4 w-4" /> Nuova News</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input className="pl-10" placeholder="Cerca..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Titolo</TableHead><TableHead>Categoria</TableHead><TableHead>Stato</TableHead><TableHead>In evidenza</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                <TableCell><Badge className={statusColors[item.status]}>{item.status}</Badge></TableCell>
                <TableCell>{item.featured ? <Badge className="bg-amber-500">Si</Badge> : <span className="text-slate-300">No</span>}</TableCell>
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
          <DialogHeader><DialogTitle>{editing ? 'Modifica News' : 'Nuova News'}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Titolo</Label><Input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug || ''} onChange={e => setForm({...form, slug: e.target.value})} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Estratto</Label><Input value={form.excerpt || ''} onChange={e => setForm({...form, excerpt: e.target.value})} /></div>
            <div className="space-y-2 md:col-span-2"><Label>Contenuto</Label><Textarea rows={6} value={form.content || ''} onChange={e => setForm({...form, content: e.target.value})} /></div>
            <div className="space-y-2"><Label>Categoria</Label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.category || 'generale'} onChange={e => setForm({...form, category: e.target.value})}>
                <option>generale</option><option>corsi</option><option>regate</option><option>soci</option><option>eventi</option><option>comunicazioni</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Stato</Label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.status || 'draft'} onChange={e => setForm({...form, status: e.target.value})}>
                <option>draft</option><option>published</option><option>archived</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Immagine URL</Label><Input value={form.image_url || ''} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
            <div className="flex items-center gap-2"><Label>In evidenza</Label><Switch checked={form.featured} onCheckedChange={v => setForm({...form, featured: v})} /></div>
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
