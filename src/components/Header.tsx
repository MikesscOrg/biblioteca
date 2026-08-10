import type { Dispatch, SetStateAction } from 'react'

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
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-sm uppercase tracking-[0.3em] elegant">Sistema de Biblioteca</h1>
          <button
            type="button"
            onClick={onLimpiarBusqueda}
            className="min-h-[44px] rounded bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafe-oscuro"
            aria-label="Limpiar la búsqueda actual"
          >
            Limpiar búsqueda
          </button>
        </div>
        <div>
          <label htmlFor="buscar-libros" className="sr-only">
            Buscar por título o autor
          </label>
          <input
            id="buscar-libros"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por título o autor"
            className="w-full min-h-[44px] rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>
    </header>
  )
}
