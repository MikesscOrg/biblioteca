import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
  showSearch?: boolean;
  busqueda?: string;
  onBusquedaChange?: (value: string) => void;
  onLimpiarBusqueda?: () => void;
};

export default function Layout({
  children,
  showSearch = false,
  busqueda = '',
  onBusquedaChange = () => undefined,
  onLimpiarBusqueda = () => undefined,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-crema text-negro-suave">
      <Header
        busqueda={busqueda}
        onBusquedaChange={onBusquedaChange}
        onLimpiarBusqueda={onLimpiarBusqueda}
        showSearch={showSearch}
      />

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">{children}</main>

      <Footer />
    </div>
  );
}
