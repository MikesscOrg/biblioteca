import { Link, useLocation } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';

type HeaderProps = {
  busqueda: string;
  onBusquedaChange: Dispatch<SetStateAction<string>>;
  onLimpiarBusqueda: () => void;
  showSearch?: boolean;
};

const navItems = [
  { to: '/', label: 'Catálogo' },
  { to: '/acerca', label: 'Acerca del Proyecto' },
];

export default function Header({
  busqueda,
  onBusquedaChange,
  onLimpiarBusqueda,
  showSearch = false,
}: HeaderProps) {
  const location = useLocation();

  return (
    <header className="bg-cafe-oscuro text-dorado px-6 py-6 shadow">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <p className="text-sm uppercase tracking-[0.3em] elegant">Sistema de Biblioteca</p>
            <nav aria-label="Navegación principal" className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-slate-100 hover:bg-white/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          {showSearch ? (
            <button
              type="button"
              onClick={onLimpiarBusqueda}
              className="rounded bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
            >
              Limpiar búsqueda
            </button>
          ) : null}
        </div>
        {showSearch ? (
          <div>
            <input
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por título o autor"
              className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-white focus:outline-none"
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
