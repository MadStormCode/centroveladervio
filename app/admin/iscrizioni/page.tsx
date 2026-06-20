'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, Download, CheckCircle, XCircle } from 'lucide-react';

export default function AdminIscrizioni() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');

  const load = async () => {
    const { data } = await supabase.from('enrollments').select('*, courses(title), regattas(title)').order('created_at', { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('enrollments').update({ status }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Stato aggiornato'); load();
  };

  const updatePayment = async (id: string, payment_status: string) => {
    const { error } = await supabase.from('enrollments').update({ payment_status }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Pagamento aggiornato'); load();
  };

  const remove = async (id: string) => {
    if (!confirm('Eliminare?')) return;
    const { error } = await supabase.from('enrollments').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Eliminata'); load();
  };

  const filtered = items.filter(i => {
    const matchesSearch = (i.first_name + ' ' + i.last_name + i.email).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || i.status === filterStatus;
    const matchesPayment = filterPayment === 'all' || i.payment_status === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const paymentColors: Record<string, string> = { pending: 'bg-amber-500', partial: 'bg-blue-500', completed: 'bg-emerald-500', refunded: 'bg-slate-500' };
  const statusColors: Record<string, string> = { pending: 'bg-amber-500', confirmed: 'bg-emerald-500', cancelled: 'bg-red-500', waitlist: 'bg-slate-500' };

  const exportCSV = () => {
    const headers = ['Nome', 'Cognome', 'Email', 'Telefono', 'Corso/Regata', 'Stato', 'Pagamento', 'Data'];
    const rows = filtered.map(i => [
      i.first_name, i.last_name, i.email, i.phone,
      i.courses?.title || i.regattas?.title || '', i.status, i.payment_status,
      new Date(i.created_at).toLocaleDateString('it-IT')
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'iscrizioni.csv'; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Gestione Iscrizioni</h1>
        <Button variant="outline" onClick={exportCSV} className="gap-2"><Download className="h-4 w-4" /> Esporta CSV</Button>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input className="pl-10" placeholder="Cerca..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Stato" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tutti</SelectItem><SelectItem value="pending">In attesa</SelectItem><SelectItem value="confirmed">Confermato</SelectItem><SelectItem value="cancelled">Cancellato</SelectItem><SelectItem value="waitlist">Lista attesa</SelectItem></SelectContent>
        </Select>
        <Select value={filterPayment} onValueChange={setFilterPayment}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Pagamento" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tutti</SelectItem><SelectItem value="pending">In attesa</SelectItem><SelectItem value="partial">Parziale</SelectItem><SelectItem value="completed">Completato</SelectItem><SelectItem value="refunded">Rimborsato</SelectItem></SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Evento</TableHead><TableHead>Stato</TableHead><TableHead>Pagamento</TableHead><TableHead>Data</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(item => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.first_name} {item.last_name}</TableCell>
                <TableCell className="text-sm">{item.email}</TableCell>
                <TableCell className="text-sm">{item.courses?.title || item.regattas?.title || 'N/A'}</TableCell>
                <TableCell>
                  <Select value={item.status} onValueChange={v => updateStatus(item.id, v)}>
                    <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="pending">In attesa</SelectItem><SelectItem value="confirmed">Confermato</SelectItem><SelectItem value="cancelled">Cancellato</SelectItem><SelectItem value="waitlist">Lista attesa</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select value={item.payment_status} onValueChange={v => updatePayment(item.id, v)}>
                    <SelectTrigger className="w-28 h-7 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="pending">In attesa</SelectItem><SelectItem value="partial">Parziale</SelectItem><SelectItem value="completed">Completato</SelectItem><SelectItem value="refunded">Rimborsato</SelectItem></SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs">{new Date(item.created_at).toLocaleDateString('it-IT')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => remove(item.id)}><XCircle className="h-4 w-4 text-red-500" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
