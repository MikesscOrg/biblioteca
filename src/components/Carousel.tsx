import { useEffect, useState } from 'react';
import { fetchCoverUrl } from '../utils/getCover';

type Item = { title: string; author?: string; url?: string };

type Props = {
  items: Item[];
  alt?: string;
};

const portadaDeRespaldo = (titulo: string) => {
  const texto = titulo.length > 36 ? `${titulo.slice(0, 35)}…` : titulo;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#4f3628"/>
        <stop offset="100%" stop-color="#d8b98a"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="760" fill="url(#g)"/>
    <circle cx="980" cy="150" r="120" fill="rgba(255,255,255,0.12)"/>
    <text x="600" y="380" fill="#f9f1e7" font-family="Georgia, serif" font-size="54"
      text-anchor="middle" dominant-baseline="middle">${texto.replace(/[<>&]/g, ' ')}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
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
    setIndex((i) => (i < items.length ? i : 0));
  }, [items.length]);

  useEffect(() => {
    if (items.length === 0) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const indiceActual = Math.min(index, items.length - 1);
  const actual = items[indiceActual];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-[#e4d5c3] bg-[#efe4d7] shadow-[0_18px_38px_rgba(79,54,40,0.12)]">
      <img
        src={covers[indiceActual] ?? portadaDeRespaldo(actual.title)}
        alt={`${alt} ${indiceActual + 1}`}
        className="h-72 w-full object-cover sm:h-80 lg:h-[22rem]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1d1a17]/80 via-[#1d1a17]/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="max-w-xl">
          <p className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f7ead8] backdrop-blur-sm">
            Destacados
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">{actual.title}</h2>
          {actual.author && <p className="mt-2 text-sm text-[#f3e6d6] sm:text-base">{actual.author}</p>}
        </div>
      </div>

      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button
          onClick={() => setIndex((indiceActual - 1 + items.length) % items.length)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f172a]/45 text-xl text-white backdrop-blur-sm transition hover:bg-[#0f172a]/60 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Mostrar el libro anterior"
        >
          ‹
        </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          onClick={() => setIndex((indiceActual + 1) % items.length)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f172a]/45 text-xl text-white backdrop-blur-sm transition hover:bg-[#0f172a]/60 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Mostrar el siguiente libro"
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${i === indiceActual ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Ir al libro ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
