import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageIcon } from 'lucide-react';

export const revalidate = 60;

async function getAlbums() {
  const { data } = await supabase.from('photo_albums').select('*, photos(count)').eq('is_public', true).order('sort_order', { ascending: true });
  return data ?? [];
}

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920" alt="" fill className="object-cover" />
        </div>
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-white/70 max-w-2xl">I momenti più belli del Centro Vela. Corsi, regate, eventi e società.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album: any) => (
              <Link key={album.id} href={`/gallery/${album.id}`} className="group">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={album.cover_image_url || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'} alt={album.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{album.photos?.count ?? 0} foto</span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-[hsl(210,50%,20%)] group-hover:text-[hsl(199,89%,48%)] transition-colors">{album.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-2">{album.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{album.category}</Badge>
                      {album.event_date && <span className="text-xs text-slate-400">{new Date(album.event_date).toLocaleDateString('it-IT')}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
