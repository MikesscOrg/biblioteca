import { useEffect, useState } from 'react';
import { fetchCoverUrl } from '../utils/getCover';

type Item = { title: string; author?: string; url?: string };

type Props = {
  items: Item[];
  alt?: string;
};

export default function Carousel({ items, alt = 'Imagen' }: Props) {
  const [index, setIndex] = useState(0);
  const [covers, setCovers] = useState<(string | null)[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all(
      items.map((item) => (item.url ? Promise.resolve(item.url) : fetchCoverUrl(item.title, item.author)))
    ).then((res) => {
      if (mounted) setCovers(res);
    });
    return () => {
      mounted = false;
    };
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100">
      <img
        src={
          covers[index] ?? `https://via.placeholder.com/1200x600.png?text=${encodeURIComponent(items[index]?.title ?? '')}`
        }
        alt={`${alt} ${index + 1}`}
        className="w-full h-64 object-cover"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button
          onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
          className="rounded-full bg-black/40 text-white p-2"
        >
          ‹
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          onClick={() => setIndex((i) => (i + 1) % items.length)}
          className="rounded-full bg-black/40 text-white p-2"
        >
          ›
        </button>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
