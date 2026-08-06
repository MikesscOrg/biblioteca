import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Carousel from './components/Carousel';
import BookCard from './components/BookCard';
import Footer from './components/Footer';
import Header from './components/Header';
import type { Book } from './models/Book';
import { sampleBooks } from './data/sampleBooks';

const STORAGE_KEY = 'biblioteca-libros';

const isBook = (item: unknown): item is Book => {
  if (typeof item !== 'object' || item === null) return false;
  const libro = item as Record<string, unknown>;

  return (
    typeof libro.id === 'string' &&
    typeof libro.titulo === 'string' &&
    typeof libro.autor === 'string' &&
    typeof libro.genero === 'string' &&
    typeof libro.anio === 'string' &&
    (libro.estado === 'Disponible' || libro.estado === 'Prestado')
  );
};

const cargarLibros = (): Book[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return sampleBooks;
  }

  const datos = localStorage.getItem(STORAGE_KEY);
  if (!datos) return sampleBooks;

  try {
    const parsed = JSON.parse(datos);
    if (!Array.isArray(parsed)) return sampleBooks;

    const librosGuardados = parsed.filter(isBook);
    return librosGuardados.length > 0 ? librosGuardados : sampleBooks;
  } catch {
    return sampleBooks;
  }
};

const generarId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `book-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

function App() {
  const [libros, setLibros] = useState<Book[]>(cargarLibros);
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState<Omit<Book, 'id'>>({
    titulo: '',
    autor: '',
    genero: '',
    anio: '',
    estado: 'Disponible',
  });
  const [libroEditandoId, setLibroEditandoId] = useState<string | null>(null);
  const [filtroAutor, setFiltroAutor] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'Todos' | 'Disponible' | 'Prestado'>('Todos');

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
  }, [libros]);

  const librosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return libros.filter((libro) => {
      if (
        texto &&
        !(
          libro.titulo.toLowerCase().includes(texto) ||
          libro.autor.toLowerCase().includes(texto)
        )
      )
        return false;
      if (filtroAutor && libro.autor !== filtroAutor) return false;
      if (filtroGenero && libro.genero !== filtroGenero) return false;
      if (filtroAnio && libro.anio !== filtroAnio) return false;
      if (filtroEstado !== 'Todos' && libro.estado !== filtroEstado) return false;
      return true;
    });
  }, [libros, busqueda, filtroAutor, filtroGenero, filtroAnio, filtroEstado]);

  const agregarLibro = (e: FormEvent) => {
    e.preventDefault();
    const titulo = form.titulo.trim();
    const autor = form.autor.trim();
    const genero = form.genero.trim();
    const anio = form.anio.trim();

    if (!titulo || !autor || !genero || !anio) return;

    const nuevoFormulario: Omit<Book, 'id'> = {
      titulo,
      autor,
      genero,
      anio,
      estado: form.estado,
    };

    if (libroEditandoId) {
      setLibros((prev) =>
        prev.map((libro) =>
          libro.id === libroEditandoId ? { ...libro, ...nuevoFormulario } : libro
        )
      );
      setLibroEditandoId(null);
    } else {
      const nuevoLibro: Book = {
        id: generarId(),
        ...nuevoFormulario,
      };

      setLibros([nuevoLibro, ...libros]);
    }

    setForm({ titulo: '', autor: '', genero: '', anio: '', estado: 'Disponible' });
  };

  const editarLibro = (libro: Book) => {
    setLibroEditandoId(libro.id);
    setForm({
      titulo: libro.titulo,
      autor: libro.autor,
      genero: libro.genero,
      anio: libro.anio,
      estado: libro.estado,
    });
  };

  const cambiarEstado = (id: string) => {
    setLibros((prev) =>
      prev.map((libro) =>
        libro.id === id
          ? {
              ...libro,
              estado: libro.estado === 'Disponible' ? 'Prestado' : 'Disponible',
            }
          : libro
      )
    );
  };

  const eliminarLibro = (id: string) => {
    const confirmar = window.confirm(
      '¿Estás seguro de eliminar este libro? Esta acción no se puede deshacer.'
    );
    if (!confirmar) return;
    setLibros((prev) => prev.filter((libro) => libro.id !== id));
  };

  const autores = useMemo(
    () =>
      Array.from(new Set(libros.map((l) => l.autor))).sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
      ),
    [libros]
  );
  const generos = useMemo(
    () =>
      Array.from(new Set(libros.map((l) => l.genero))).sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
      ),
    [libros]
  );
  const anios = useMemo(
    () =>
      Array.from(new Set(libros.map((l) => l.anio))).sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base', numeric: true })
      ),
    [libros]
  );

  const featuredBooks = useMemo(
    () => libros.slice(0, 5).map((l) => ({ title: l.titulo, author: l.autor })),
    [libros]
  );

  return (
    <div className="min-h-screen flex flex-col bg-crema text-negro-suave">
      <Header
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        onLimpiarBusqueda={() => setBusqueda('')}
      />

      <main className="flex-1 mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <Carousel items={featuredBooks} />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={agregarLibro} className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              {libroEditandoId ? 'Editar libro' : 'Agregar libro'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded border border-slate-300 px-3 py-2"
                placeholder="Título"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
              <input
                className="rounded border border-slate-300 px-3 py-2"
                placeholder="Autor"
                value={form.autor}
                onChange={(e) => setForm({ ...form, autor: e.target.value })}
              />
              <input
                className="rounded border border-slate-300 px-3 py-2"
                placeholder="Género"
                value={form.genero}
                onChange={(e) => setForm({ ...form, genero: e.target.value })}
              />
              <input
                className="rounded border border-slate-300 px-3 py-2"
                placeholder="Año"
                value={form.anio}
                onChange={(e) => setForm({ ...form, anio: e.target.value })}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="rounded bg-slate-900 px-4 py-2 font-medium text-white">
                {libroEditandoId ? 'Actualizar libro' : 'Guardar libro'}
              </button>
              {libroEditandoId && (
                <button
                  type="button"
                  onClick={() => {
                    setLibroEditandoId(null);
                    setForm({ titulo: '', autor: '', genero: '', anio: '', estado: 'Disponible' });
                  }}
                  className="rounded border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Filtros</h2>
            <label className="block mb-2 text-sm">Autor</label>
            <select
              value={filtroAutor}
              onChange={(e) => setFiltroAutor(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 mb-4"
            >
              <option value="">Todos</option>
              {autores.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <label className="block mb-2 text-sm">Género</label>
            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 mb-4"
            >
              <option value="">Todos</option>
              {generos.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <label className="block mb-2 text-sm">Año</label>
            <select
              value={filtroAnio}
              onChange={(e) => setFiltroAnio(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2 mb-4"
            >
              <option value="">Todos</option>
              {anios.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <label className="block mb-2 text-sm">Disponibilidad</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | 'Disponible' | 'Prestado')}
              className="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="Todos">Todos</option>
              <option value="Disponible">Disponibles</option>
              <option value="Prestado">Prestados</option>
            </select>
            <button
              type="button"
              onClick={() => {
                setFiltroAutor('');
                setFiltroGenero('');
                setFiltroAnio('');
                setFiltroEstado('Todos');
              }}
              className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Limpiar filtros
            </button>
          </div>
        </section>
        <section className="mt-8">
          {librosFiltrados.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center text-slate-600 shadow">
              No se encontraron libros que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {librosFiltrados.map((libro) => (
                <BookCard
                  key={libro.id}
                  libro={libro}
                  onEdit={editarLibro}
                  onDelete={eliminarLibro}
                  onToggle={cambiarEstado}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
