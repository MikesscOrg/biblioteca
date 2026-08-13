import { useEffect, useMemo, useState, type FormEvent } from 'react';
import BookCard from './components/BookCard';
import BookFilters from './components/BookFilters';
import BookForm from './components/BookForm';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Header from './components/Header';
import EmptyState from './components/EmptyState';
import type { Book } from './models/Book';
import { sampleBooks } from './data/sampleBooks';
import { crearFormularioDesdeLibro, crearFormularioVacio, filtrarLibros } from './utils/bookUtils';

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
  const [form, setForm] = useState<Omit<Book, 'id'>>(crearFormularioVacio());
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

  const autorActivo = autores.includes(filtroAutor) ? filtroAutor : '';
  const generoActivo = generos.includes(filtroGenero) ? filtroGenero : '';
  const anioActivo = anios.includes(filtroAnio) ? filtroAnio : '';

  useEffect(() => {
    if (filtroAutor !== autorActivo) setFiltroAutor(autorActivo);
    if (filtroGenero !== generoActivo) setFiltroGenero(generoActivo);
    if (filtroAnio !== anioActivo) setFiltroAnio(anioActivo);
  }, [filtroAutor, filtroGenero, filtroAnio, autorActivo, generoActivo, anioActivo]);

  const librosFiltrados = useMemo(
    () =>
      filtrarLibros(libros, busqueda, autorActivo, generoActivo, anioActivo, filtroEstado),
    [libros, busqueda, autorActivo, generoActivo, anioActivo, filtroEstado]
  );

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

      setLibros((prev) => [nuevoLibro, ...prev]);
    }

    setForm(crearFormularioVacio());
  };

  const editarLibro = (libro: Book) => {
    setLibroEditandoId(libro.id);
    setForm(crearFormularioDesdeLibro(libro));
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

  const actualizarCampo = (campo: keyof Omit<Book, 'id'>, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltroAutor('');
    setFiltroGenero('');
    setFiltroAnio('');
    setFiltroEstado('Todos');
  };

  const cancelarEdicion = () => {
    setLibroEditandoId(null);
    setForm(crearFormularioVacio());
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
        onAction: limpiarFiltros,
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

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <Carousel items={featuredBooks} />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]" aria-label="Formulario y filtros de libros">
          <BookForm
            form={form}
            libroEditandoId={libroEditandoId}
            onSubmit={agregarLibro}
            onChange={actualizarCampo}
            onCancel={cancelarEdicion}
          />
          <BookFilters
            autores={autores}
            generos={generos}
            anios={anios}
            autorActivo={autorActivo}
            generoActivo={generoActivo}
            anioActivo={anioActivo}
            filtroEstado={filtroEstado}
            onAutorChange={setFiltroAutor}
            onGeneroChange={setFiltroGenero}
            onAnioChange={setFiltroAnio}
            onEstadoChange={setFiltroEstado}
            onLimpiar={limpiarFiltros}
          />
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
