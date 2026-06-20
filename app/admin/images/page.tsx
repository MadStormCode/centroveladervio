'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Save, ImageIcon } from 'lucide-react';

interface SiteImage {
  id: string;
  key: string;
  label: string;
  url: string;
  group: string;
}

const imageGroups = [
  {
    group: 'hero',
    label: 'Hero / Homepage',
    images: [
      { key: 'hero_home', label: 'Hero Home (sfondo principale)', default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920' },
      { key: 'hero_corsi', label: 'Hero Corsi', default: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920' },
      { key: 'hero_regate', label: 'Hero Regate', default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920' },
      { key: 'hero_chi_siamo', label: 'Hero Chi Siamo', default: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920' },
      { key: 'hero_news', label: 'Hero News', default: 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=1920' },
      { key: 'hero_gallery', label: 'Hero Gallery', default: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920' },
    ]
  },
  {
    group: 'courses',
    label: 'Corsi',
    images: [
      { key: 'course_optimist', label: 'Corso Optimist', default: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800' },
      { key: 'course_laser', label: 'Corso Laser', default: 'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?w=800' },
      { key: 'course_adulti', label: 'Corso Adulti', default: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800' },
      { key: 'course_420', label: 'Corso 420', default: 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?w=800' },
      { key: 'course_skiff', label: 'Corso Skiff', default: 'https://images.unsplash.com/photo-1520454974749-611b7248ffc6?w=800' },
      { key: 'course_bambini', label: 'Corso Bambini', default: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800' },
    ]
  },
  {
    group: 'logo',
    label: 'Logo e Brand',
    images: [
      { key: 'logo_main', label: 'Logo Principale', default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300' },
      { key: 'favicon', label: 'Favicon', default: '' },
      { key: 'og_image', label: 'Open Graph Image (social)', default: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200' },
    ]
  }
];

export default function AdminImages() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const loadImages = async () => {
    const { data } = await supabase.from('site_settings').select('*').like('key', 'img_%');
    const map: Record<string, string> = {};
    if (data) {
      data.forEach((s: any) => { map[s.key] = s.value || ''; });
    }
    // Ensure all defaults exist
    imageGroups.forEach(g => {
      g.images.forEach(img => {
        if (!map[img.key]) map[img.key] = img.default;
      });
    });
    setImages(map);
    setLoading(false);
  };

  useEffect(() => { loadImages(); }, []);

  const saveImages = async () => {
    for (const [key, url] of Object.entries(images)) {
      const { data } = await supabase.from('site_settings').select('id').eq('key', key).single();
      if (data) {
        await supabase.from('site_settings').update({ value: url }).eq('id', data.id);
      } else {
        const group = imageGroups.find(g => g.images.some(i => i.key === key))?.group || 'images';
        await supabase.from('site_settings').insert({ key, value: url, group_name: group });
      }
    }
    toast.success('Immagini salvate');
    loadImages();
  };

  const updateImage = (key: string, url: string) => {
    setImages(prev => ({ ...prev, [key]: url }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(210,50%,20%)] flex items-center gap-2">
          <ImageIcon className="h-6 w-6" /> Immagini Sito
        </h1>
        <Button onClick={saveImages} className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white gap-2">
          <Save className="h-4 w-4" /> Salva Tutte
        </Button>
      </div>

      <div className="space-y-6">
        {imageGroups.map(group => (
          <Card key={group.group} className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] mb-4">{group.label}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.images.map(img => (
                  <div key={img.key} className="space-y-2">
                    <Label className="text-sm">{img.label}</Label>
                    <Input
                      value={images[img.key] || ''}
                      onChange={e => updateImage(img.key, e.target.value)}
                      placeholder={img.default}
                    />
                    {images[img.key] && (
                      <div className="relative h-24 rounded-lg overflow-hidden bg-slate-100">
                        <img src={images[img.key]} alt={img.label} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
