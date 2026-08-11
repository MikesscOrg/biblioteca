import type { Dispatch, SetStateAction } from 'react';

export default function Header({
  busqueda,
  onBusquedaChange,
  onLimpiarBusqueda,
}: {
  busqueda: string;
  onBusquedaChange: Dispatch<SetStateAction<string>>;
  onLimpiarBusqueda: () => void;
}) {
  return (
    <header className="bg-cafe-oscuro px-6 py-6 text-dorado shadow">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm uppercase tracking-[0.3em] elegant">Sistema de Biblioteca</p>
          <button
            type="button"
            onClick={onLimpiarBusqueda}
            className="rounded bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
          >
            Limpiar búsqueda
          </button>
        </div>
        <div>
          <label htmlFor="buscar-libros" className="sr-only">
            Buscar libros
          </label>
          <input
            id="buscar-libros"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por título o autor"
            className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/70"
          />
        </div>
      </div>
    </header>
  );
}
