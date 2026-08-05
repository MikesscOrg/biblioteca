import { useEffect, useState } from 'react';
import { fetchCoverUrl } from '../utils/getCover';

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anio: string;
  estado: 'Disponible' | 'Prestado';
};

export default function BookCard({
  libro,
  onEdit,
  onDelete,
  onToggle,
}: {
  libro: Libro;
  onEdit: (l: Libro) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const [cover, setCover] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchCoverUrl(libro.titulo, libro.autor).then((url) => {
      if (mounted) setCover(url);
    });
    return () => {
      mounted = false;
    };
  }, [libro.titulo, libro.autor]);

  return (
    <article className="rounded-2xl bg-white p-5 shadow flex flex-col">
      <img
        src={cover ?? `https://via.placeholder.com/400x600.png?text=${encodeURIComponent(libro.titulo)}`}
        alt={libro.titulo}
        className="book-cover"
      />
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{libro.titulo}</h3>
          <p className="text-sm text-slate-500">{libro.autor}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            libro.estado === 'Disponible' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          {libro.estado}
        </span>
      </div>
      <div className="mt-2 text-sm text-slate-600">
        <p>Género: {libro.genero}</p>
        <p>Año: {libro.anio}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onToggle(libro.id)}
          className="min-h-[44px] rounded bg-[#6F4E37] px-4 py-3 text-sm text-white"
        >
          {libro.estado === 'Disponible' ? 'Marcar como prestado' : 'Marcar como disponible'}
        </button>
        <button
          onClick={() => onEdit(libro)}
          className="min-h-[44px] rounded bg-[#B38B59] px-4 py-3 text-sm text-white"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(libro.id)}
          className="min-h-[44px] rounded bg-rose-600 px-4 py-3 text-sm text-white"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
