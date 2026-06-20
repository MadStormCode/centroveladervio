'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save, Settings } from 'lucide-react';

const groups = [
  { key: 'general', label: 'Generali' },
  { key: 'contact', label: 'Contatti' },
  { key: 'schedule', label: 'Orari' },
  { key: 'social', label: 'Social' },
  { key: 'footer', label: 'Footer' },
  { key: 'seo', label: 'SEO' },
];

export default function AdminImpostazioni() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('site_settings').select('*').order('group_name');
    setSettings(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveAll = async () => {
    for (const s of settings) {
      const { error } = await supabase.from('site_settings').update({ value: s.value }).eq('id', s.id);
      if (error) { toast.error(error.message); return; }
    }
    toast.success('Impostazioni salvate');
  };

  const updateValue = (id: string, value: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, value } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)] flex items-center gap-2"><Settings className="h-6 w-6" /> Impostazioni Sito</h1>
        <Button onClick={saveAll} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2"><Save className="h-4 w-4" /> Salva Tutto</Button>
      </div>
      <div className="space-y-6">
        {groups.map(group => {
          const items = settings.filter(s => s.group_name === group.key);
          if (items.length === 0) return null;
          return (
            <Card key={group.key} className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-4">{group.label}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map(s => (
                    <div key={s.id} className="space-y-2">
                      <Label className="text-sm text-slate-500 capitalize">{s.key.replace(/_/g, ' ')}</Label>
                      <Input value={s.value || ''} onChange={e => updateValue(s.id, e.target.value)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
