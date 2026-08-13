import { useState, type Dispatch, type SetStateAction } from 'react';

export type MenuOption =
  | 'inicio'
  | 'disponibles'
  | 'cuenta'
  | 'inicio-sesion'
  | 'ayuda'
  | 'favoritos'
  | 'novedades';

export default function Header({
  busqueda,
  onBusquedaChange,
  onLimpiarBusqueda,
  onSelectMenu,
}: {
  busqueda: string;
  onBusquedaChange: Dispatch<SetStateAction<string>>;
  onLimpiarBusqueda: () => void;
  onSelectMenu: (option: MenuOption) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems: { label: string; value: MenuOption }[] = [
    { label: 'Inicio', value: 'inicio' },
    { label: 'Libros disponibles', value: 'disponibles' },
    { label: 'Cuenta', value: 'cuenta' },
    { label: 'Inicio de sesión', value: 'inicio-sesion' },
    { label: 'Ayuda', value: 'ayuda' },
    { label: 'Favoritos', value: 'favoritos' },
    { label: 'Novedades', value: 'novedades' },
  ];

  return (
    <header className="border-b border-[#d7cab8] bg-[#4f3628] px-4 py-4 text-[#f6ebdc] shadow-lg shadow-[#3b2a22]/15 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f6ebdc] text-lg font-bold text-[#4f3628] shadow-sm">
              B
            </div>
            <h1 className="text-sm uppercase tracking-[0.28em] text-[#f4d9b2] elegant">Biblioteca</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#f4d9b2]"
                aria-label="Abrir menú principal"
              >
                Menú
                <span className="text-base">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#f6ebdc] text-[#2d2d2d] shadow-xl">
                  {menuItems.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        onSelectMenu(item.value);
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between border-b border-[#e4d4c2] px-4 py-3 text-left text-sm font-medium transition hover:bg-[#efe1d3] last:border-b-0"
                    >
                      <span>{item.label}</span>
                      <span className="text-[#7a5c46]">›</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onLimpiarBusqueda}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#f4d9b2] px-4 py-2 text-sm font-semibold text-[#2d2d2d] transition hover:bg-[#efc98f] focus:outline-none focus:ring-2 focus:ring-[#f4d9b2]"
              aria-label="Limpiar la búsqueda actual"
            >
              Limpiar búsqueda
            </button>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="buscar-libros" className="sr-only">
            Buscar por título o autor
          </label>
          <input
            id="buscar-libros"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por título, autor o género"
            className="w-full min-h-[48px] rounded-full border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder:text-[#f0d9b9] focus:border-[#f4d9b2] focus:outline-none focus:ring-2 focus:ring-[#f4d9b2]"
          />
        </div>
      </div>
    </header>
  );
}
