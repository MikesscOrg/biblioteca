import type { Book } from '../models/Book';
import { sampleBooks } from '../data/sampleBooks';

export default function Catalog({ books }: { books?: Book[] }) {
  const list = books ?? sampleBooks;

  return (
    <main className="flex-1 mx-auto max-w-6xl px-6 py-8">
      <h2 className="mb-6 text-2xl font-semibold">Catálogo de libros</h2>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((book) => (
          <article key={book.id} className="rounded-2xl bg-white p-5 shadow">
            <h3 className="text-lg font-semibold">{book.titulo}</h3>
            <p className="text-sm text-slate-600">{book.autor}</p>
            <div className="mt-3 text-sm text-slate-600">
              <p>Género: {book.genero}</p>
              <p>Año: {book.anio}</p>
            </div>
            <div className="mt-4">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                book.estado === 'Disponible' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {book.estado}
              </span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
