export type BookState = 'Disponible' | 'Prestado';

export type Book = {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anio: string;
  estado: BookState;
};
