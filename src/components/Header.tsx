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
    <header className="bg-cafe-oscuro px-4 py-4 text-dorado shadow sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <h1 className="text-sm uppercase tracking-[0.3em] elegant">Sistema de Biblioteca</h1>
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
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafe-oscuro"
              aria-label="Limpiar la búsqueda actual"
            >
              Limpiar búsqueda
            </button>
          ) : null}
        </div>
        {showSearch ? (
          <div>
            <label htmlFor="buscar-libros" className="sr-only">
              Buscar por título o autor
            </label>
            <input
              id="buscar-libros"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Buscar por título o autor"
              className="w-full min-h-[44px] rounded-full border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-slate-300 focus:border-white focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}
