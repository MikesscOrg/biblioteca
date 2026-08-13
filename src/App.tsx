import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Carousel from './components/Carousel';
import BookCard from './components/BookCard';
import Footer from './components/Footer';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import type { Book } from './models/Book';
import { sampleBooks } from './data/sampleBooks';
import { validarLibro, type BookFormErrors } from './utils/validateBookForm';

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
  const [errores, setErrores] = useState<BookFormErrors>({});

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
    const erroresDelFormulario = validarLibro(form);
    setErrores(erroresDelFormulario);

    if (Object.keys(erroresDelFormulario).length > 0) {
      return;
    }

    const titulo = form.titulo.trim();
    const autor = form.autor.trim();
    const genero = form.genero.trim();
    const anio = form.anio.trim();

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

      setLibros((prev) => [nuevoLibro, ...prev]);
    }

    setErrores({});
    setForm({ titulo: '', autor: '', genero: '', anio: '', estado: 'Disponible' });
  };

  const editarLibro = (libro: Book) => {
    setLibroEditandoId(libro.id);
    setErrores({});
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

  const actualizarCampo = (campo: keyof typeof form, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: undefined }));
  };

  const vacioCatalogo = libros.length === 0;
  const hayBusqueda = busqueda.trim().length > 0;
  const hayFiltrosActivos = Boolean(autorActivo || generoActivo || anioActivo || filtroEstado !== 'Todos');

  const estadoListado = useMemo(() => {
    if (vacioCatalogo) {
      return {
        title: 'El catálogo aún está vacío',
        description:
          'Aún no hay libros registrados. Agrega el primero para empezar a construir tu colección.',
        actionLabel: 'Agregar libro',
        onAction: () => {
          const formulario = document.querySelector('form');
          formulario?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
      };
    }

    if (hayBusqueda && librosFiltrados.length === 0) {
      return {
        title: 'No hay resultados para tu búsqueda',
        description:
          'Prueba con otro término o limpia la búsqueda para ver todos los libros disponibles.',
        actionLabel: 'Limpiar búsqueda',
        onAction: () => setBusqueda(''),
      };
    }

    if (hayFiltrosActivos && librosFiltrados.length === 0) {
      return {
        title: 'No hay libros con esos filtros',
        description:
          'Cambia uno o más filtros para ver otros libros o limpia los filtros para volver al catálogo completo.',
        actionLabel: 'Limpiar filtros',
        onAction: () => {
          setFiltroAutor('');
          setFiltroGenero('');
          setFiltroAnio('');
          setFiltroEstado('Todos');
        },
      };
    }

    return null;
  }, [vacioCatalogo, hayBusqueda, hayFiltrosActivos, librosFiltrados.length]);

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
              <div className="md:col-span-2">
                <input
                  className={`w-full rounded border px-3 py-2 transition ${errores.titulo ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                  placeholder="Título"
                  value={form.titulo}
                  onChange={(e) => actualizarCampo('titulo', e.target.value)}
                  aria-invalid={Boolean(errores.titulo)}
                  aria-describedby={errores.titulo ? 'error-titulo' : undefined}
                />
                <div className="mt-1 min-h-[1.25rem]">
                  {errores.titulo && (
                    <p id="error-titulo" className="text-sm text-red-600" role="alert">
                      {errores.titulo}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <input
                  className={`w-full rounded border px-3 py-2 transition ${errores.autor ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                  placeholder="Autor"
                  value={form.autor}
                  onChange={(e) => actualizarCampo('autor', e.target.value)}
                  aria-invalid={Boolean(errores.autor)}
                  aria-describedby={errores.autor ? 'error-autor' : undefined}
                />
                <div className="mt-1 min-h-[1.25rem]">
                  {errores.autor && (
                    <p id="error-autor" className="text-sm text-red-600" role="alert">
                      {errores.autor}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <input
                  className={`w-full rounded border px-3 py-2 transition ${errores.genero ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                  placeholder="Género"
                  value={form.genero}
                  onChange={(e) => actualizarCampo('genero', e.target.value)}
                  aria-invalid={Boolean(errores.genero)}
                  aria-describedby={errores.genero ? 'error-genero' : undefined}
                />
                <div className="mt-1 min-h-[1.25rem]">
                  {errores.genero && (
                    <p id="error-genero" className="text-sm text-red-600" role="alert">
                      {errores.genero}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <input
                  className={`w-full rounded border px-3 py-2 transition ${errores.anio ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                  placeholder="Año"
                  value={form.anio}
                  onChange={(e) => actualizarCampo('anio', e.target.value)}
                  aria-invalid={Boolean(errores.anio)}
                  aria-describedby={errores.anio ? 'error-anio' : undefined}
                />
                <div className="mt-1 min-h-[1.25rem]">
                  {errores.anio && (
                    <p id="error-anio" className="text-sm text-red-600" role="alert">
                      {errores.anio}
                    </p>
                  )}
                </div>
              </div>
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
                    setErrores({});
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
              value={autorActivo}
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
              value={generoActivo}
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
              value={anioActivo}
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
          {estadoListado ? (
            <EmptyState
              title={estadoListado.title}
              description={estadoListado.description}
              actionLabel={estadoListado.actionLabel}
              onAction={estadoListado.onAction}
            />
          ) : librosFiltrados.length === 0 ? (
            <EmptyState
              title="No hay libros para mostrar"
              description="Intenta ajustar la búsqueda o los filtros para encontrar lo que buscas."
            />
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
