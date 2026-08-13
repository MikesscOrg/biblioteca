import type { Book } from '../models/Book';

export type BookFormValues = Omit<Book, 'id'>;

export const crearFormularioVacio = (): BookFormValues => ({
  titulo: '',
  autor: '',
  genero: '',
  anio: '',
  estado: 'Disponible',
});

export const crearFormularioDesdeLibro = (libro: Book): BookFormValues => ({
  titulo: libro.titulo,
  autor: libro.autor,
  genero: libro.genero,
  anio: libro.anio,
  estado: libro.estado,
});

export const filtrarLibros = (
  libros: Book[],
  busqueda: string,
  autorActivo: string,
  generoActivo: string,
  anioActivo: string,
  filtroEstado: 'Todos' | 'Disponible' | 'Prestado'
): Book[] => {
  const texto = busqueda.toLowerCase();

  return libros.filter((libro) => {
    if (
      texto &&
      !(libro.titulo.toLowerCase().includes(texto) || libro.autor.toLowerCase().includes(texto))
    ) {
      return false;
    }

    if (autorActivo && libro.autor !== autorActivo) return false;
    if (generoActivo && libro.genero !== generoActivo) return false;
    if (anioActivo && libro.anio !== anioActivo) return false;
    if (filtroEstado !== 'Todos' && libro.estado !== filtroEstado) return false;

    return true;
  });
};
