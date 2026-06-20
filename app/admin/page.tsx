'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen, Trophy, ClipboardList, Newspaper, ImageIcon, FileText, Users, TrendingUp, ArrowUpRight,
  Calendar, AlertTriangle, CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    courses: 0, regattas: 0, enrollments: 0, news: 0, albums: 0, documents: 0, users: 0
  });
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);
  const [upcomingCourses, setUpcomingCourses] = useState<any[]>([]);
  const [upcomingRegattas, setUpcomingRegattas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [{ count: courses }, { count: regattas }, { count: enrollments }, { count: news }, { count: albums }, { count: documents }, { count: users }] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('regattas').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('news').select('*', { count: 'exact', head: true }),
        supabase.from('photo_albums').select('*', { count: 'exact', head: true }),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      setStats({
        courses: courses ?? 0, regattas: regattas ?? 0, enrollments: enrollments ?? 0,
        news: news ?? 0, albums: albums ?? 0, documents: documents ?? 0, users: users ?? 0
      });

      const { data: recentEnr } = await supabase.from('enrollments').select('*, courses(title), regattas(title)').order('created_at', { ascending: false }).limit(5);
      setRecentEnrollments(recentEnr ?? []);

      const { data: upCourses } = await supabase.from('courses').select('*').eq('is_active', true).gte('period_start', new Date().toISOString()).order('period_start', { ascending: true }).limit(5);
      setUpcomingCourses(upCourses ?? []);

      const { data: upRegattas } = await supabase.from('regattas').select('*').eq('status', 'upcoming').order('start_date', { ascending: true }).limit(5);
      setUpcomingRegattas(upRegattas ?? []);
      setLoading(false);
    }
    loadData();
  }, []);

  const statCards = [
    { label: 'Corsi', value: stats.courses, icon: BookOpen, href: '/admin/corsi', color: 'bg-blue-50 text-blue-600' },
    { label: 'Regate', value: stats.regattas, icon: Trophy, href: '/admin/regate', color: 'bg-amber-50 text-amber-600' },
    { label: 'Iscrizioni', value: stats.enrollments, icon: ClipboardList, href: '/admin/iscrizioni', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'News', value: stats.news, icon: Newspaper, href: '/admin/news', color: 'bg-purple-50 text-purple-600' },
    { label: 'Album', value: stats.albums, icon: ImageIcon, href: '/admin/gallery', color: 'bg-rose-50 text-rose-600' },
    { label: 'Documenti', value: stats.documents, icon: FileText, href: '/admin/documenti', color: 'bg-slate-50 text-slate-600' },
    { label: 'Utenti', value: stats.users, icon: Users, href: '/admin/utenti', color: 'bg-cyan-50 text-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[hsl(210,50%,20%)]">Dashboard</h1>
        <div className="text-sm text-slate-500">Benvenuto nell'area amministrativa</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-[hsl(210,50%,20%)]">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Courses */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[hsl(199,89%,48%)]" /> Prossimi Corsi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingCourses.length === 0 && <div className="text-sm text-slate-400 py-4 text-center">Nessun corso in programma</div>}
            {upcomingCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <div className="font-medium text-sm">{c.title}</div>
                  <div className="text-xs text-slate-400">{c.period_start && new Date(c.period_start).toLocaleDateString('it-IT')}</div>
                </div>
                <Badge variant={c.registrations_open ? 'default' : 'secondary'} className={c.registrations_open ? 'bg-emerald-500' : ''}>{c.registrations_open ? 'Aperte' : 'Chiuse'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Regattas */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[hsl(199,89%,48%)]" /> Prossime Regate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingRegattas.length === 0 && <div className="text-sm text-slate-400 py-4 text-center">Nessuna regata in programma</div>}
            {upcomingRegattas.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <div className="font-medium text-sm">{r.title}</div>
                  <div className="text-xs text-slate-400">{new Date(r.start_date).toLocaleDateString('it-IT')}</div>
                </div>
                <Badge variant="outline" className="text-xs">{r.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[hsl(199,89%,48%)]" /> Ultime Iscrizioni
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEnrollments.length === 0 && <div className="text-sm text-slate-400 py-4 text-center">Nessuna iscrizione recente</div>}
            {recentEnrollments.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <div className="font-medium text-sm">{e.first_name} {e.last_name}</div>
                  <div className="text-xs text-slate-400">{e.courses?.title || e.regattas?.title || 'N/A'}</div>
                </div>
                <Badge variant={e.payment_status === 'completed' ? 'default' : 'secondary'} className={e.payment_status === 'completed' ? 'bg-emerald-500' : ''}>
                  {e.payment_status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
