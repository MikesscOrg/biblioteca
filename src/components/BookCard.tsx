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
  const actionClass =
    'min-h-[44px] flex-1 rounded-2xl bg-[#5d4033] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4d332b] focus:outline-none focus:ring-2 focus:ring-[#5d4033] focus:ring-offset-2';

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-[#e7ddd0] bg-white p-4 shadow-[0_12px_30px_rgba(77,51,43,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(77,51,43,0.12)] sm:p-5">
      <div className="flex flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 inline-flex rounded-full bg-[#f4efe8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6d564a]">
              Libro
            </p>
            <h3 className="break-words text-xl font-semibold leading-7 text-[#2d2d2d]">
              {libro.titulo}
            </h3>
            <p className="mt-2 text-sm text-[#5b4d46]">
              por <span className="font-medium text-[#2d2d2d]">{libro.autor}</span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                libro.estado === 'Disponible'
                  ? 'bg-[#e5f4ea] text-[#1d7a46]'
                  : 'bg-[#fbe9d7] text-[#a25b1e]'
              }`}
            >
              {libro.estado}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8f847d]">
              {libro.estado === 'Disponible' ? 'Listo para entrega' : 'Actualmente prestado'}
            </span>
          </div>
        </div>

        <div className="grid gap-3 rounded-3xl bg-[#f8f4f1] p-4 text-sm text-[#4b3d39]">
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-[#2d2d2d]">Género</span>
            <span className="truncate">{libro.genero}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-medium text-[#2d2d2d]">Año</span>
            <span>{libro.anio}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={() => onToggle(libro.id)}
            className={actionClass}
            aria-label={`Cambiar disponibilidad de ${libro.titulo}`}
          >
            {libro.estado === 'Disponible' ? 'Marcar como prestado' : 'Marcar como disponible'}
          </button>
          <button
            onClick={() => onEdit(libro)}
            className={actionClass}
            aria-label={`Editar el libro ${libro.titulo}`}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(libro.id)}
            className={actionClass}
            aria-label={`Eliminar el libro ${libro.titulo}`}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
