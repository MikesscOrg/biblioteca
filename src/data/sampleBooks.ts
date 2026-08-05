import type { Book } from '../models/Book';

export const sampleBooks: Book[] = [
  {
    id: 'b1',
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    genero: 'Fábula',
    anio: '1943',
    estado: 'Disponible',
  },
  {
    id: 'b2',
    titulo: '1984',
    autor: 'George Orwell',
    genero: 'Distopía',
    anio: '1949',
    estado: 'Disponible',
  },
  {
    id: 'b3',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    genero: 'Realismo mágico',
    anio: '1967',
    estado: 'Prestado',
  },
  {
    id: 'b4',
    titulo: 'El gran Gatsby',
    autor: 'F. Scott Fitzgerald',
    genero: 'Novela',
    anio: '1925',
    estado: 'Disponible',
  },
  {
    id: 'b5',
    titulo: 'Fahrenheit 451',
    autor: 'Ray Bradbury',
    genero: 'Distopía',
    anio: '1953',
    estado: 'Disponible',
  },
  {
    id: 'b6',
    titulo: 'El Hobbit',
    autor: 'J. R. R. Tolkien',
    genero: 'Fantasía',
    anio: '1937',
    estado: 'Prestado',
  },
];
