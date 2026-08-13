import type { FormEvent } from 'react';
import type { BookFormValues } from '../utils/bookUtils';

type BookFormProps = {
  form: BookFormValues;
  libroEditandoId: string | null;
  onSubmit: (e: FormEvent) => void;
  onChange: (campo: keyof BookFormValues, valor: string) => void;
  onCancel: () => void;
};

function BookForm({ form, libroEditandoId, onSubmit, onChange, onCancel }: BookFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">
        {libroEditandoId ? 'Editar libro' : 'Agregar libro'}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="titulo-libro" className="mb-2 block text-sm font-medium text-slate-700">
            Título
          </label>
          <input
            id="titulo-libro"
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => onChange('titulo', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="autor-libro" className="mb-2 block text-sm font-medium text-slate-700">
            Autor
          </label>
          <input
            id="autor-libro"
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Autor"
            value={form.autor}
            onChange={(e) => onChange('autor', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="genero-libro" className="mb-2 block text-sm font-medium text-slate-700">
            Género
          </label>
          <input
            id="genero-libro"
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Género"
            value={form.genero}
            onChange={(e) => onChange('genero', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="anio-libro" className="mb-2 block text-sm font-medium text-slate-700">
            Año
          </label>
          <input
            id="anio-libro"
            className="w-full rounded border border-slate-300 px-3 py-2"
            placeholder="Año"
            value={form.anio}
            onChange={(e) => onChange('anio', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="rounded bg-slate-900 px-4 py-2 font-medium text-white">
          {libroEditandoId ? 'Actualizar libro' : 'Guardar libro'}
        </button>
        {libroEditandoId && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default BookForm;
