export type BookState = 'Disponible' | 'Prestado';

export type Book = {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anio: string;
  estado: BookState;
};

// Ejemplo de objeto Book reutilizable para pruebas
export const exampleBook: Book = {
  id: 'example-1',
  titulo: 'Ejemplo de Libro',
  autor: 'Autor Ejemplo',
  genero: 'Demo',
  anio: '2026',
  estado: 'Disponible',
};
