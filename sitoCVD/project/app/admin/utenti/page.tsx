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
import { Pencil, Search, Shield } from 'lucide-react';

export default function AdminUtenti() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (item: any) => { setEditing(item); setForm({ ...item }); setDialogOpen(true); };

  const save = async () => {
    const { error } = await supabase.from('profiles').update({ role: form.role, full_name: form.full_name, phone: form.phone }).eq('id', editing.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Utente aggiornato'); setDialogOpen(false); load();
  };

  const filtered = items.filter(i => (i.full_name || i.email || '').toLowerCase().includes(search.toLowerCase()));
  const roleColors: Record<string, string> = { admin: 'bg-red-500', segreteria: 'bg-purple-500', istruttore: 'bg-blue-500', editor: 'bg-amber-500', socio: 'bg-emerald-500' };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Gestione Utenti</h1>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input className="pl-10" placeholder="Cerca..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Ruolo</TableHead><TableHead>Telefono</TableHead><TableHead>FIV</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.full_name || '-'}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell><Badge className={roleColors[item.role] || 'bg-slate-500'}>{item.role}</Badge></TableCell>
                <TableCell>{item.phone || '-'}</TableCell>
                <TableCell>{item.fiv_number || '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Modifica Utente</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Nome</Label><Input value={form.full_name || ''} onChange={e => setForm({...form, full_name: e.target.value})} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email || ''} disabled /></div>
            <div className="space-y-2"><Label>Telefono</Label><Input value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label>Ruolo</Label>
              <select className="w-full rounded-md border px-3 py-2 text-sm" value={form.role || 'socio'} onChange={e => setForm({...form, role: e.target.value})}>
                <option>admin</option><option>segreteria</option><option>istruttore</option><option>editor</option><option>socio</option>
              </select>
            </div>
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
