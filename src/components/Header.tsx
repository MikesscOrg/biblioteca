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
    <header className="bg-cafe-oscuro text-dorado px-6 py-6 shadow">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.3em] elegant">Sistema de Biblioteca</p>
          <button
            type="button"
            onClick={onLimpiarBusqueda}
            className="rounded bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
          >
            Limpiar búsqueda
          </button>
        </div>
        <div>
          <input
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por título o autor"
            className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-white focus:outline-none"
          />
        </div>
      </div>
    </header>
  )
}
