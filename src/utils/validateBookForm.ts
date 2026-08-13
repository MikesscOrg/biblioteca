export type BookFormField = 'titulo' | 'autor' | 'genero' | 'anio';
export type BookFormErrors = Partial<Record<BookFormField, string>>;

export const validarLibro = (form: {
  titulo: string;
  autor: string;
  genero: string;
  anio: string;
}): BookFormErrors => {
  const errores: BookFormErrors = {};
  const titulo = form.titulo.trim();
  const autor = form.autor.trim();
  const genero = form.genero.trim();
  const anioTexto = form.anio.trim();

  if (!titulo) {
    errores.titulo = 'El título del libro es obligatorio.';
  }

  if (!autor) {
    errores.autor = 'El autor del libro es obligatorio.';
  }

  if (!genero) {
    errores.genero = 'El género del libro es obligatorio.';
  }

  if (!anioTexto) {
    errores.anio = 'El año de publicación es obligatorio.';
  } else {
    const anioNumero = Number(anioTexto);
    if (!Number.isInteger(anioNumero) || anioNumero <= 0) {
      errores.anio = 'Ingresa un año válido.';
    }
  }

  return errores;
};
