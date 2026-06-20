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

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    setLoading(false);
    if (error) { toast.error(error); }
    else { toast.success('Accesso effettuato'); router.push('/admin'); }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="w-full max-w-md px-4">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-[hsl(199,89%,48%)]/10 flex items-center justify-center mx-auto mb-4">
              <Anchor className="h-8 w-8 text-[hsl(199,89%,48%)]" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)]">Accedi al Centro Vela</h1>
            <p className="text-sm text-slate-500">Inserisci le tue credenziali per accedere</p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="tuo@email.it" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <Button type="submit" className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Accesso...</> : 'Accedi'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-slate-500">
              Non hai un account? <Link href="/register" className="text-[hsl(199,89%,48%)] hover:underline">Registrati</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
