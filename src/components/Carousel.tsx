import { useEffect, useState } from 'react';
import { fetchCoverUrl } from '../utils/getCover';

type Item = { title: string; author?: string; url?: string };

type Props = {
  items: Item[];
  alt?: string;
};

// Portada de respaldo: SVG embebido, para no depender de un servicio externo
// cuando openlibrary.org no devuelve imagen o no hay red.
const portadaDeRespaldo = (titulo: string) => {
  const texto = titulo.length > 40 ? `${titulo.slice(0, 39)}…` : titulo;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600">
    <rect width="1200" height="600" fill="#3b2f2a"/>
    <text x="600" y="300" fill="#d9c39b" font-family="Georgia, serif" font-size="48"
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
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  // El catálogo puede encoger (al eliminar libros) y dejar el índice fuera de rango.
  const indiceActual = Math.min(index, items.length - 1);
  const actual = items[indiceActual];

  return (
    <div className="relative rounded-2xl overflow-hidden bg-gray-100">
      <img
        src={covers[indiceActual] ?? portadaDeRespaldo(actual.title)}
        alt={`${alt} ${indiceActual + 1}`}
        className="w-full h-64 object-cover"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <button
          onClick={() => setIndex((indiceActual - 1 + items.length) % items.length)}
          className="rounded-full bg-black/40 text-white p-2"
        >
          ‹
        </button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <button
          onClick={() => setIndex((indiceActual + 1) % items.length)}
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
            className={`w-2 h-2 rounded-full ${i === indiceActual ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
