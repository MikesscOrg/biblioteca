import type { Book } from '../models/Book';

export default function BookCard({
  libro,
  onEdit,
  onDelete,
  onToggle,
}: {
  libro: Book;
  onEdit: (l: Book) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-5">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
              Libro
            </p>
            <h3 className="break-words text-xl font-semibold leading-7 text-slate-900">
              {libro.titulo}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              por <span className="font-medium text-slate-900">{libro.autor}</span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                libro.estado === 'Disponible'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {libro.estado}
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {libro.estado === 'Disponible' ? 'Listo para entrega' : 'Actualmente prestado'}
            </span>
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-slate-900">Género</span>
            <span className="truncate">{libro.genero}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-slate-900">Año</span>
            <span>{libro.anio}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => onToggle(libro.id)}
            className="min-h-[44px] flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            aria-label={`Cambiar disponibilidad de ${libro.titulo}`}
          >
            {libro.estado === 'Disponible' ? 'Marcar como prestado' : 'Marcar como disponible'}
          </button>
          <button
            onClick={() => onEdit(libro)}
            className="min-h-[44px] flex-1 rounded-2xl bg-[#B38B59] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a67b4a] focus:outline-none focus:ring-2 focus:ring-[#B38B59] focus:ring-offset-2"
            aria-label={`Editar el libro ${libro.titulo}`}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(libro.id)}
            className="min-h-[44px] flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2"
            aria-label={`Eliminar el libro ${libro.titulo}`}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
