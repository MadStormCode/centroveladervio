'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Search, Download } from 'lucide-react';

export default function AdminDocumenti() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (item: any) => { setEditing(item); setForm({ ...item }); setDialogOpen(true); };
  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', file_url: '', file_type: 'pdf', category: 'interno', is_public: true, expiry_date: '' });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.file_url) { toast.error('Compila titolo e URL file'); return; }
    const payload = { ...form };
    if (editing) {
      const { error } = await supabase.from('documents').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Documento aggiornato');
    } else {
      const { error } = await supabase.from('documents').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Documento creato');
    }
    setDialogOpen(false); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminare?')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Eliminato'); load();
  };

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Gestione Documenti</h1>
        <Button onClick={openCreate} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2"><Plus className="h-4 w-4" /> Nuovo Documento</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input className="pl-10" placeholder="Cerca..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Titolo</TableHead><TableHead>Categoria</TableHead><TableHead>Pubblico</TableHead><TableHead>Scadenza</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                <TableCell>{item.is_public ? <Badge className="bg-emerald-500">Si</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                <TableCell>{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString('it-IT') : '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <a href={item.file_url} target="_blank"><Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button></a>
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
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Modifica Documento' : 'Nuovo Documento'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Titolo</Label><Input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Descrizione</Label><Input value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} /></div>
            <div className="space-y-2"><Label>File URL</Label><Input value={form.file_url || ''} onChange={e => setForm({...form, file_url: e.target.value})} /></div>
            <div className="space-y-2"><Label>Tipo</Label><Input value={form.file_type || ''} onChange={e => setForm({...form, file_type: e.target.value})} /></div>
            <div className="space-y-2"><Label>Categoria</Label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.category || 'interno'} onChange={e => setForm({...form, category: e.target.value})}>
                <option>statuto</option><option>moduli_fiv</option><option>documenti_interni</option><option>regolamenti</option><option>comunicazioni</option><option>altro</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Scadenza</Label><Input type="date" value={form.expiry_date || ''} onChange={e => setForm({...form, expiry_date: e.target.value})} /></div>
            <div className="flex items-center gap-2"><Label>Pubblico</Label><input type="checkbox" checked={form.is_public} onChange={e => setForm({...form, is_public: e.target.checked})} /></div>
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
