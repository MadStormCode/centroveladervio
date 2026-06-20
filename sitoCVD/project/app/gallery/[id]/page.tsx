import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ImageIcon } from 'lucide-react';

export const revalidate = 60;

async function getAlbum(id: string) {
  const { data } = await supabase.from('photo_albums').select('*').eq('id', id).single();
  return data;
}

async function getPhotos(albumId: string) {
  const { data } = await supabase.from('photos').select('*').eq('album_id', albumId).order('sort_order', { ascending: true });
  return data ?? [];
}

export default async function AlbumDetailPage({ params }: { params: { id: string } }) {
  const album = await getAlbum(params.id);
  if (!album) return notFound();
  const photos = await getPhotos(album.id);

  return (
    <>
      <section className="bg-[hsl(210,50%,20%)] text-white py-12 relative">
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <Link href="/gallery">
            <Button variant="ghost" className="text-white mb-4 hover:bg-white/20 gap-2"><ArrowLeft className="h-4 w-4" /> Torna alla gallery</Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{album.title}</h1>
          <p className="text-white/70 mt-2">{album.description}</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          {photos.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <ImageIcon className="h-12 w-12 mx-auto mb-4" />
              <p>Questo album non contiene ancora foto.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer">
                  <Image src={photo.url} alt={photo.caption || album.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
