import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Carousel from './components/Carousel';
import BookCard from './components/BookCard';
import Footer from './components/Footer';
import Header from './components/Header';

type Libro = {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anio: string;
  estado: 'Disponible' | 'Prestado';
};

const librosIniciales: Libro[] = [
  { id: '1', titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', genero: 'Novela', anio: '1605', estado: 'Disponible' },
  { id: '2', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', genero: 'Realismo mágico', anio: '1967', estado: 'Disponible' },
  { id: '3', titulo: 'El principito', autor: 'Antoine de Saint-Exupéry', genero: 'Fábula', anio: '1943', estado: 'Disponible' },
  { id: '4', titulo: '1984', autor: 'George Orwell', genero: 'Distopía', anio: '1949', estado: 'Disponible' },
  { id: '5', titulo: 'Rebelión en la granja', autor: 'George Orwell', genero: 'Sátira', anio: '1945', estado: 'Disponible' },
  { id: '6', titulo: 'Orgullo y prejuicio', autor: 'Jane Austen', genero: 'Romance', anio: '1813', estado: 'Disponible' },
  { id: '7', titulo: 'Emma', autor: 'Jane Austen', genero: 'Romance', anio: '1815', estado: 'Disponible' },
  { id: '8', titulo: 'Matar a un ruiseñor', autor: 'Harper Lee', genero: 'Drama', anio: '1960', estado: 'Disponible' },
  { id: '9', titulo: 'El gran Gatsby', autor: 'F. Scott Fitzgerald', genero: 'Novela', anio: '1925', estado: 'Disponible' },
  { id: '10', titulo: 'Drácula', autor: 'Bram Stoker', genero: 'Terror', anio: '1897', estado: 'Disponible' },
  { id: '11', titulo: 'Frankenstein', autor: 'Mary Shelley', genero: 'Terror', anio: '1818', estado: 'Disponible' },
  { id: '12', titulo: 'It', autor: 'Stephen King', genero: 'Terror', anio: '1986', estado: 'Disponible' },
  { id: '13', titulo: 'El resplandor', autor: 'Stephen King', genero: 'Terror', anio: '1977', estado: 'Disponible' },
  { id: '14', titulo: 'Carrie', autor: 'Stephen King', genero: 'Terror', anio: '1974', estado: 'Disponible' },
  { id: '15', titulo: 'Misery', autor: 'Stephen King', genero: 'Suspenso', anio: '1987', estado: 'Disponible' },
  { id: '16', titulo: 'El Hobbit', autor: 'J. R. R. Tolkien', genero: 'Fantasía', anio: '1937', estado: 'Disponible' },
  { id: '17', titulo: 'La comunidad del anillo', autor: 'J. R. R. Tolkien', genero: 'Fantasía', anio: '1954', estado: 'Disponible' },
  { id: '18', titulo: 'Las dos torres', autor: 'J. R. R. Tolkien', genero: 'Fantasía', anio: '1954', estado: 'Disponible' },
  { id: '19', titulo: 'El retorno del rey', autor: 'J. R. R. Tolkien', genero: 'Fantasía', anio: '1955', estado: 'Disponible' },
  { id: '20', titulo: 'El Silmarillion', autor: 'J. R. R. Tolkien', genero: 'Fantasía', anio: '1977', estado: 'Disponible' },
  { id: '21', titulo: 'Harry Potter y la piedra filosofal', autor: 'J. K. Rowling', genero: 'Fantasía', anio: '1997', estado: 'Disponible' },
  { id: '22', titulo: 'Harry Potter y la cámara secreta', autor: 'J. K. Rowling', genero: 'Fantasía', anio: '1998', estado: 'Disponible' },
  { id: '23', titulo: 'Harry Potter y el prisionero de Azkaban', autor: 'J. K. Rowling', genero: 'Fantasía', anio: '1999', estado: 'Disponible' },
  { id: '24', titulo: 'Harry Potter y el cáliz de fuego', autor: 'J. K. Rowling', genero: 'Fantasía', anio: '2000', estado: 'Disponible' },
  { id: '25', titulo: 'Harry Potter y la Orden del Fénix', autor: 'J. K. Rowling', genero: 'Fantasía', anio: '2003', estado: 'Disponible' },
  { id: '26', titulo: 'Harry Potter y el misterio del príncipe', autor: 'J. K. Rowling', genero: 'Fantasía', anio: '2005', estado: 'Disponible' },
  { id: '27', titulo: 'Harry Potter y las reliquias de la muerte', autor: 'J. K. Rowling', genero: 'Fantasía', anio: '2007', estado: 'Disponible' },
  { id: '28', titulo: 'Los juegos del hambre', autor: 'Suzanne Collins', genero: 'Distopía', anio: '2008', estado: 'Disponible' },
  { id: '29', titulo: 'En llamas', autor: 'Suzanne Collins', genero: 'Distopía', anio: '2009', estado: 'Disponible' },
  { id: '30', titulo: 'Sinsajo', autor: 'Suzanne Collins', genero: 'Distopía', anio: '2010', estado: 'Disponible' },
  { id: '31', titulo: 'Dune', autor: 'Frank Herbert', genero: 'Ciencia ficción', anio: '1965', estado: 'Disponible' },
  { id: '32', titulo: 'Fundación', autor: 'Isaac Asimov', genero: 'Ciencia ficción', anio: '1951', estado: 'Disponible' },
  { id: '33', titulo: 'Yo, robot', autor: 'Isaac Asimov', genero: 'Ciencia ficción', anio: '1950', estado: 'Disponible' },
  { id: '34', titulo: 'Neuromante', autor: 'William Gibson', genero: 'Cyberpunk', anio: '1984', estado: 'Disponible' },
  { id: '35', titulo: 'Fahrenheit 451', autor: 'Ray Bradbury', genero: 'Distopía', anio: '1953', estado: 'Disponible' },
  { id: '36', titulo: 'Crónicas marcianas', autor: 'Ray Bradbury', genero: 'Ciencia ficción', anio: '1950', estado: 'Disponible' },
  { id: '37', titulo: 'Un mundo feliz', autor: 'Aldous Huxley', genero: 'Distopía', anio: '1932', estado: 'Disponible' },
  { id: '38', titulo: 'La máquina del tiempo', autor: 'H. G. Wells', genero: 'Ciencia ficción', anio: '1895', estado: 'Disponible' },
  { id: '39', titulo: 'La guerra de los mundos', autor: 'H. G. Wells', genero: 'Ciencia ficción', anio: '1898', estado: 'Disponible' },
  { id: '40', titulo: 'Viaje al centro de la Tierra', autor: 'Julio Verne', genero: 'Aventura', anio: '1864', estado: 'Disponible' },
  { id: '41', titulo: 'Veinte mil leguas de viaje submarino', autor: 'Julio Verne', genero: 'Aventura', anio: '1870', estado: 'Disponible' },
  { id: '42', titulo: 'La vuelta al mundo en 80 días', autor: 'Julio Verne', genero: 'Aventura', anio: '1872', estado: 'Disponible' },
  { id: '43', titulo: 'Los tres mosqueteros', autor: 'Alexandre Dumas', genero: 'Aventura', anio: '1844', estado: 'Disponible' },
  { id: '44', titulo: 'El conde de Montecristo', autor: 'Alexandre Dumas', genero: 'Aventura', anio: '1844', estado: 'Disponible' },
  { id: '45', titulo: 'La isla del tesoro', autor: 'Robert L. Stevenson', genero: 'Aventura', anio: '1883', estado: 'Disponible' },
  { id: '46', titulo: 'Moby-Dick', autor: 'Herman Melville', genero: 'Aventura', anio: '1851', estado: 'Disponible' },
  { id: '47', titulo: 'La Odisea', autor: 'Homero', genero: 'Épica', anio: 'Siglo VIII a. C.', estado: 'Disponible' },
  { id: '48', titulo: 'La Ilíada', autor: 'Homero', genero: 'Épica', anio: 'Siglo VIII a. C.', estado: 'Disponible' },
  { id: '49', titulo: 'La divina comedia', autor: 'Dante Alighieri', genero: 'Poesía épica', anio: '1321', estado: 'Disponible' },
  { id: '50', titulo: 'Hamlet', autor: 'William Shakespeare', genero: 'Tragedia', anio: '1603', estado: 'Disponible' },
  { id: '51', titulo: 'Macbeth', autor: 'William Shakespeare', genero: 'Tragedia', anio: '1606', estado: 'Disponible' },
  { id: '52', titulo: 'Romeo y Julieta', autor: 'William Shakespeare', genero: 'Tragedia', anio: '1597', estado: 'Disponible' },
  { id: '53', titulo: 'Otelo', autor: 'William Shakespeare', genero: 'Tragedia', anio: '1604', estado: 'Disponible' },
  { id: '54', titulo: 'El mercader de Venecia', autor: 'William Shakespeare', genero: 'Drama', anio: '1600', estado: 'Disponible' },
  { id: '55', titulo: 'Crimen y castigo', autor: 'Fiódor Dostoievski', genero: 'Novela', anio: '1866', estado: 'Disponible' },
  { id: '56', titulo: 'Los hermanos Karamázov', autor: 'Fiódor Dostoievski', genero: 'Novela', anio: '1880', estado: 'Disponible' },
  { id: '57', titulo: 'El idiota', autor: 'Fiódor Dostoievski', genero: 'Novela', anio: '1869', estado: 'Disponible' },
  { id: '58', titulo: 'Guerra y paz', autor: 'León Tolstói', genero: 'Novela histórica', anio: '1869', estado: 'Disponible' },
  { id: '59', titulo: 'Ana Karenina', autor: 'León Tolstói', genero: 'Novela', anio: '1878', estado: 'Disponible' },
  { id: '60', titulo: 'Madame Bovary', autor: 'Gustave Flaubert', genero: 'Novela', anio: '1857', estado: 'Disponible' },
  { id: '61', titulo: 'Los miserables', autor: 'Victor Hugo', genero: 'Novela histórica', anio: '1862', estado: 'Disponible' },
  { id: '62', titulo: 'Nuestra Señora de París', autor: 'Victor Hugo', genero: 'Novela histórica', anio: '1831', estado: 'Disponible' },
  { id: '63', titulo: 'El retrato de Dorian Gray', autor: 'Oscar Wilde', genero: 'Novela', anio: '1890', estado: 'Disponible' },
  { id: '64', titulo: 'El extranjero', autor: 'Albert Camus', genero: 'Filosófica', anio: '1942', estado: 'Disponible' },
  { id: '65', titulo: 'La peste', autor: 'Albert Camus', genero: 'Filosófica', anio: '1947', estado: 'Disponible' },
  { id: '66', titulo: 'El proceso', autor: 'Franz Kafka', genero: 'Existencialista', anio: '1925', estado: 'Disponible' },
  { id: '67', titulo: 'La metamorfosis', autor: 'Franz Kafka', genero: 'Novela corta', anio: '1915', estado: 'Disponible' },
  { id: '68', titulo: 'Siddhartha', autor: 'Hermann Hesse', genero: 'Filosófica', anio: '1922', estado: 'Disponible' },
  { id: '69', titulo: 'Demian', autor: 'Hermann Hesse', genero: 'Novela', anio: '1919', estado: 'Disponible' },
  { id: '70', titulo: 'El lobo estepario', autor: 'Hermann Hesse', genero: 'Novela', anio: '1927', estado: 'Disponible' },
  { id: '71', titulo: 'El alquimista', autor: 'Paulo Coelho', genero: 'Ficción', anio: '1988', estado: 'Disponible' },
  { id: '72', titulo: 'Veronika decide morir', autor: 'Paulo Coelho', genero: 'Drama', anio: '1998', estado: 'Disponible' },
  { id: '73', titulo: 'El código Da Vinci', autor: 'Dan Brown', genero: 'Misterio', anio: '2003', estado: 'Disponible' },
  { id: '74', titulo: 'Ángeles y demonios', autor: 'Dan Brown', genero: 'Misterio', anio: '2000', estado: 'Disponible' },
  { id: '75', titulo: 'Inferno', autor: 'Dan Brown', genero: 'Suspenso', anio: '2013', estado: 'Disponible' },
  { id: '76', titulo: 'Sherlock Holmes: Estudio en escarlata', autor: 'Arthur Conan Doyle', genero: 'Detectivesca', anio: '1887', estado: 'Disponible' },
  { id: '77', titulo: 'El sabueso de los Baskerville', autor: 'Arthur Conan Doyle', genero: 'Detectivesca', anio: '1902', estado: 'Disponible' },
  { id: '78', titulo: 'Asesinato en el Orient Express', autor: 'Agatha Christie', genero: 'Misterio', anio: '1934', estado: 'Disponible' },
  { id: '79', titulo: 'Diez negritos', autor: 'Agatha Christie', genero: 'Misterio', anio: '1939', estado: 'Disponible' },
  { id: '80', titulo: 'Muerte en el Nilo', autor: 'Agatha Christie', genero: 'Misterio', anio: '1937', estado: 'Disponible' },
  { id: '81', titulo: 'La chica del tren', autor: 'Paula Hawkins', genero: 'Suspenso', anio: '2015', estado: 'Disponible' },
  { id: '82', titulo: 'Perdida', autor: 'Gillian Flynn', genero: 'Suspenso', anio: '2012', estado: 'Disponible' },
  { id: '83', titulo: 'Bajo la misma estrella', autor: 'John Green', genero: 'Romance', anio: '2012', estado: 'Disponible' },
  { id: '84', titulo: 'Ciudades de papel', autor: 'John Green', genero: 'Juvenil', anio: '2008', estado: 'Disponible' },
  { id: '85', titulo: 'El diario de Ana Frank', autor: 'Ana Frank', genero: 'Biografía', anio: '1947', estado: 'Disponible' },
  { id: '86', titulo: 'Steve Jobs', autor: 'Walter Isaacson', genero: 'Biografía', anio: '2011', estado: 'Disponible' },
  { id: '87', titulo: 'Sapiens', autor: 'Yuval Noah Harari', genero: 'Historia', anio: '2011', estado: 'Disponible' },
  { id: '88', titulo: 'Homo Deus', autor: 'Yuval Noah Harari', genero: 'Ensayo', anio: '2015', estado: 'Disponible' },
  { id: '89', titulo: 'Hábitos atómicos', autor: 'James Clear', genero: 'Desarrollo personal', anio: '2018', estado: 'Disponible' },
  { id: '90', titulo: 'Los 7 hábitos de la gente altamente efectiva', autor: 'Stephen R. Covey', genero: 'Desarrollo personal', anio: '1989', estado: 'Disponible' },
  { id: '91', titulo: 'Padre rico, padre pobre', autor: 'Robert T. Kiyosaki', genero: 'Finanzas', anio: '1997', estado: 'Disponible' },
  { id: '92', titulo: 'Pensar rápido, pensar despacio', autor: 'Daniel Kahneman', genero: 'Psicología', anio: '2011', estado: 'Disponible' },
  { id: '93', titulo: 'El poder del ahora', autor: 'Eckhart Tolle', genero: 'Espiritualidad', anio: '1997', estado: 'Disponible' },
  { id: '94', titulo: 'Cómo ganar amigos e influir sobre las personas', autor: 'Dale Carnegie', genero: 'Desarrollo personal', anio: '1936', estado: 'Disponible' },
  { id: '95', titulo: 'El arte de la guerra', autor: 'Sun Tzu', genero: 'Estrategia', anio: 'Siglo V a. C.', estado: 'Disponible' },
  { id: '96', titulo: 'El príncipe', autor: 'Nicolás Maquiavelo', genero: 'Política', anio: '1532', estado: 'Disponible' },
  { id: '97', titulo: 'Cosmos', autor: 'Carl Sagan', genero: 'Ciencia', anio: '1980', estado: 'Disponible' },
  { id: '98', titulo: 'Breves respuestas a las grandes preguntas', autor: 'Stephen Hawking', genero: 'Ciencia', anio: '2018', estado: 'Disponible' },
  { id: '99', titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', genero: 'Fantasía', anio: '2007', estado: 'Disponible' },
  { id: '100', titulo: 'Canción de hielo y fuego: Juego de tronos', autor: 'George R. R. Martin', genero: 'Fantasía', anio: '1996', estado: 'Disponible' },
];

const STORAGE_KEY = 'biblioteca-libros';

function App() {
  const [libros, setLibros] = useState<Libro[]>(() => {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? (JSON.parse(datos) as Libro[]) : librosIniciales;
  });
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState<Omit<Libro, 'id'>>({
    titulo: '',
    autor: '',
    genero: '',
    anio: '',
    estado: 'Disponible',
  });
  const [libroEditandoId, setLibroEditandoId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filtroAutor, setFiltroAutor] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');

  useEffect(() => {
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
      return true;
    });
  }, [libros, busqueda, filtroAutor, filtroGenero, filtroAnio]);

  const agregarLibro = (e: FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.autor || !form.genero || !form.anio) return;

    if (libroEditandoId) {
      setLibros((prev) =>
        prev.map((libro) =>
          libro.id === libroEditandoId ? { ...libro, ...form } : libro
        )
      );
      setLibroEditandoId(null);
    } else {
      const nuevoLibro: Libro = {
        id: crypto.randomUUID(),
        ...form,
      };

      setLibros([nuevoLibro, ...libros]);
    }

    setForm({ titulo: '', autor: '', genero: '', anio: '', estado: 'Disponible' });
  };

  const editarLibro = (libro: Libro) => {
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
    const confirmar = window.confirm('¿Deseas eliminar este libro?');
    if (!confirmar) return;
    setLibros((prev) => prev.filter((libro) => libro.id !== id));
  };

  const autores = Array.from(new Set(libros.map((l) => l.autor)));
  const generos = Array.from(new Set(libros.map((l) => l.genero)));
  const anios = Array.from(new Set(libros.map((l) => l.anio)));

  const featuredBooks = libros.slice(0, 5).map((l) => ({ title: l.titulo, author: l.autor }));

  return (
    <div className="min-h-screen flex flex-col bg-crema text-negro-suave">
      <Header />

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
            <button className="mt-4 rounded bg-slate-900 px-4 py-2 font-medium text-white">
              {libroEditandoId ? 'Actualizar libro' : 'Guardar libro'}
            </button>
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
              className="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="">Todos</option>
              {anios.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </section>
        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {librosFiltrados.map((libro) => (
            <BookCard
              key={libro.id}
              libro={libro}
              onEdit={editarLibro}
              onDelete={eliminarLibro}
              onToggle={cambiarEstado}
            />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
