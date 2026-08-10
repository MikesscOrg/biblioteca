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

  // Si el último libro de un autor/género/año se elimina o se edita, el filtro
  // seleccionado deja de existir en la lista: se ignora y se limpia el estado.
  const autorActivo = autores.includes(filtroAutor) ? filtroAutor : '';
  const generoActivo = generos.includes(filtroGenero) ? filtroGenero : '';
  const anioActivo = anios.includes(filtroAnio) ? filtroAnio : '';

  useEffect(() => {
    if (filtroAutor !== autorActivo) setFiltroAutor(autorActivo);
    if (filtroGenero !== generoActivo) setFiltroGenero(generoActivo);
    if (filtroAnio !== anioActivo) setFiltroAnio(anioActivo);
  }, [filtroAutor, filtroGenero, filtroAnio, autorActivo, generoActivo, anioActivo]);

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
      if (autorActivo && libro.autor !== autorActivo) return false;
      if (generoActivo && libro.genero !== generoActivo) return false;
      if (anioActivo && libro.anio !== anioActivo) return false;
      if (filtroEstado !== 'Todos' && libro.estado !== filtroEstado) return false;
      return true;
    });
  }, [libros, busqueda, autorActivo, generoActivo, anioActivo, filtroEstado]);

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

      <main className="mx-auto flex-1 max-w-6xl px-6 py-8">
        <div className="mb-8">
          <Carousel items={featuredBooks} />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-label="Formulario y filtros de libros">
          <form onSubmit={agregarLibro} className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">
              {libroEditandoId ? 'Editar libro' : 'Agregar libro'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="titulo-libro" className="mb-2 block text-sm font-medium text-slate-700">
                  Título
                </label>
                <input
                  id="titulo-libro"
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Título"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="autor-libro" className="mb-2 block text-sm font-medium text-slate-700">
                  Autor
                </label>
                <input
                  id="autor-libro"
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Autor"
                  value={form.autor}
                  onChange={(e) => setForm({ ...form, autor: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="genero-libro" className="mb-2 block text-sm font-medium text-slate-700">
                  Género
                </label>
                <input
                  id="genero-libro"
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Género"
                  value={form.genero}
                  onChange={(e) => setForm({ ...form, genero: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="anio-libro" className="mb-2 block text-sm font-medium text-slate-700">
                  Año
                </label>
                <input
                  id="anio-libro"
                  className="w-full rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Año"
                  value={form.anio}
                  onChange={(e) => setForm({ ...form, anio: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button className="min-h-[44px] rounded bg-slate-900 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2">
                {libroEditandoId ? 'Actualizar libro' : 'Guardar libro'}
              </button>
              {libroEditandoId && (
                <button
                  type="button"
                  onClick={() => {
                    setLibroEditandoId(null);
                    setForm({ titulo: '', autor: '', genero: '', anio: '', estado: 'Disponible' });
                  }}
                  className="min-h-[44px] rounded border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Filtros</h2>
            <label htmlFor="filtro-autor" className="mb-2 block text-sm font-medium text-slate-700">
              Autor
            </label>
            <select
              id="filtro-autor"
              value={autorActivo}
              onChange={(e) => setFiltroAutor(e.target.value)}
              className="mb-4 w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Todos</option>
              {autores.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <label htmlFor="filtro-genero" className="mb-2 block text-sm font-medium text-slate-700">
              Género
            </label>
            <select
              id="filtro-genero"
              value={generoActivo}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="mb-4 w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Todos</option>
              {generos.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <label htmlFor="filtro-anio" className="mb-2 block text-sm font-medium text-slate-700">
              Año
            </label>
            <select
              id="filtro-anio"
              value={anioActivo}
              onChange={(e) => setFiltroAnio(e.target.value)}
              className="mb-4 w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <option value="">Todos</option>
              {anios.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <label htmlFor="filtro-disponibilidad" className="mb-2 block text-sm font-medium text-slate-700">
              Disponibilidad
            </label>
            <select
              id="filtro-disponibilidad"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as 'Todos' | 'Disponible' | 'Prestado')}
              className="w-full min-h-[44px] rounded border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
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
              className="mt-4 min-h-[44px] rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Limpiar filtros
            </button>
          </div>
        </section>
        <section className="mt-8" aria-label="Catálogo de libros">
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
