'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Anchor, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Le password non coincidono'); return; }
    if (form.password.length < 6) { toast.error('La password deve essere di almeno 6 caratteri'); return; }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.fullName);
    setLoading(false);
    if (error) { toast.error(error); }
    else { toast.success('Registrazione completata! Controlla la tua email.'); router.push('/login'); }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="w-full max-w-md px-4">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-[hsl(199,89%,48%)]/10 flex items-center justify-center mx-auto mb-4">
              <Anchor className="h-8 w-8 text-[hsl(199,89%,48%)]" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Registrati</h1>
            <p className="text-sm text-slate-500">Crea un nuovo account sul Centro Vela</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome e Cognome</Label>
                <Input id="fullName" required placeholder="Mario Rossi" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="tuo@email.it" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Conferma Password</Label>
                <Input id="confirmPassword" type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Registrazione...</> : 'Registrati'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-slate-500">
              Hai già un account? <Link href="/login" className="text-[hsl(199,89%,48%)] hover:underline">Accedi</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
