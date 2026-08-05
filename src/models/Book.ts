export type Book = {
  id: string;
  titulo: string;
  autor: string;
  genero: string;
  anio: string;
  estado: 'Disponible' | 'Prestado';
};
