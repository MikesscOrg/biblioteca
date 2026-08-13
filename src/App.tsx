import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Carousel from './components/Carousel';
import BookCard from './components/BookCard';
import Footer from './components/Footer';
import Header, { type MenuOption } from './components/Header';
import EmptyState from './components/EmptyState';
import type { Book } from './models/Book';
import { sampleBooks } from './data/sampleBooks';
import { fetchCoverUrl } from './utils/getCover';
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
  const [miniCovers, setMiniCovers] = useState<Record<string, string | null>>({});

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

  const normalizarTexto = (valor: string) =>
    valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  const buscarCoincidencias = (libro: Book, texto: string) => {
    if (!texto) return true;

    const query = normalizarTexto(texto);
    const titulo = normalizarTexto(libro.titulo);
    const autor = normalizarTexto(libro.autor);
    const genero = normalizarTexto(libro.genero);

    if (
      titulo.includes(query) ||
      autor.includes(query) ||
      genero.includes(query) ||
      `${titulo} ${autor}`.includes(query)
    ) {
      return true;
    }

    const palabras = query.split(/\s+/).filter(Boolean);
    return palabras.some((palabra) =>
      titulo.includes(palabra) || autor.includes(palabra) || genero.includes(palabra)
    );
  };

  const librosFiltrados = useMemo(() => {
    return libros.filter((libro) => {
      if (!buscarCoincidencias(libro, busqueda)) return false;
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

  useEffect(() => {
    const cargarMiniPortadas = async () => {
      const resultados: Record<string, string | null> = {};
      for (const libro of libros) {
        resultados[libro.id] = await fetchCoverUrl(libro.titulo, libro.autor);
      }
      setMiniCovers(resultados);
    };

    void cargarMiniPortadas();
  }, [libros]);

  const manejarMenu = (opcion: MenuOption) => {
    switch (opcion) {
      case 'inicio':
        setBusqueda('');
        setFiltroAutor('');
        setFiltroGenero('');
        setFiltroAnio('');
        setFiltroEstado('Todos');
        break;
      case 'disponibles':
        setFiltroEstado('Disponible');
        setBusqueda('');
        break;
      case 'cuenta':
        setBusqueda('cuenta');
        break;
      case 'inicio-sesion':
        setBusqueda('login');
        break;
      case 'ayuda':
        setBusqueda('ayuda');
        break;
      case 'favoritos':
        setBusqueda('favoritos');
        break;
      case 'novedades':
        setBusqueda('nuevo');
        break;
      default:
        break;
    }
  };

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
        onSelectMenu={manejarMenu}
      />

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <Carousel items={featuredBooks} />
        </div>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_320px]" aria-label="Formulario y filtros de libros">
          <div className="space-y-6">
            <form onSubmit={agregarLibro} className="rounded-3xl bg-white p-4 shadow-[0_20px_45px_rgba(81,58,48,0.09)] sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-[#2d2d2d]">
                {libroEditandoId ? 'Editar libro' : 'Agregar libro'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="titulo-libro" className="mb-2 block text-sm font-medium text-slate-700">
                    Título
                  </label>
                  <input
                    id="titulo-libro"
                    className={`w-full rounded-xl border px-3 py-2.5 transition ${errores.titulo ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#4f3628]`}
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
                  <label htmlFor="autor-libro" className="mb-2 block text-sm font-medium text-slate-700">
                    Autor
                  </label>
                  <input
                    id="autor-libro"
                    className={`w-full rounded-xl border px-3 py-2.5 transition ${errores.autor ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#4f3628]`}
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
                  <label htmlFor="genero-libro" className="mb-2 block text-sm font-medium text-slate-700">
                    Género
                  </label>
                  <input
                    id="genero-libro"
                    className={`w-full rounded-xl border px-3 py-2.5 transition ${errores.genero ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#4f3628]`}
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
                  <label htmlFor="anio-libro" className="mb-2 block text-sm font-medium text-slate-700">
                    Año
                  </label>
                  <input
                    id="anio-libro"
                    className={`w-full rounded-xl border px-3 py-2.5 transition ${errores.anio ? 'border-red-500 bg-red-50' : 'border-slate-300'} focus:outline-none focus:ring-2 focus:ring-[#4f3628]`}
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
                <button className="min-h-[44px] rounded-full bg-[#4f3628] px-4 py-2.5 font-medium text-white transition hover:bg-[#3e2b22] focus:outline-none focus:ring-2 focus:ring-[#4f3628] focus:ring-offset-2">
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
                    className="min-h-[44px] rounded-full border border-slate-300 bg-white px-4 py-2.5 text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            <div className="rounded-3xl bg-white p-4 shadow-[0_20px_45px_rgba(81,58,48,0.09)] sm:p-6">
              <h2 className="mb-4 text-xl font-semibold text-[#2d2d2d]">Filtros</h2>
              <label htmlFor="filtro-autor" className="mb-2 block text-sm font-medium text-slate-700">
                Autor
              </label>
              <select
                id="filtro-autor"
                value={autorActivo}
                onChange={(e) => setFiltroAutor(e.target.value)}
                className="mb-4 w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4f3628]"
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
                className="mb-4 w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4f3628]"
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
                className="mb-4 w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4f3628]"
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
                className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4f3628]"
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
                className="mt-4 min-h-[44px] rounded-full bg-[#4f3628] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#3e2b22] focus:outline-none focus:ring-2 focus:ring-[#4f3628] focus:ring-offset-2"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          <aside className="rounded-3xl bg-[#f5efe9] p-4 shadow-[0_20px_45px_rgba(81,58,48,0.08)] sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#2d2d2d]">Portadas</h3>
              <span className="rounded-full bg-[#4f3628] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                {libros.length}
              </span>
            </div>
            <div className="space-y-3">
              {libros.slice(0, 8).map((libro) => (
                <div key={libro.id} className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-sm">
                  <img
                    src={miniCovers[libro.id] ?? 'https://placehold.co/80x110/f7f0e7/4f3628?text=Libro'}
                    alt={`Portada de ${libro.titulo}`}
                    className="h-16 w-12 rounded-xl object-cover shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#2d2d2d]">{libro.titulo}</p>
                    <p className="truncate text-xs text-[#6d564a]">{libro.autor}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#8f847d]">{libro.estado}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8" aria-label="Catálogo de libros">
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
