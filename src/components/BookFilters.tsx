import type { Book } from '../models/Book';

type BookFiltersProps = {
  autores: string[];
  generos: string[];
  anios: string[];
  autorActivo: string;
  generoActivo: string;
  anioActivo: string;
  filtroEstado: 'Todos' | 'Disponible' | 'Prestado';
  onAutorChange: (valor: string) => void;
  onGeneroChange: (valor: string) => void;
  onAnioChange: (valor: string) => void;
  onEstadoChange: (valor: 'Todos' | 'Disponible' | 'Prestado') => void;
  onLimpiar: () => void;
};

function BookFilters({
  autores,
  generos,
  anios,
  autorActivo,
  generoActivo,
  anioActivo,
  filtroEstado,
  onAutorChange,
  onGeneroChange,
  onAnioChange,
  onEstadoChange,
  onLimpiar,
}: BookFiltersProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Filtros</h2>
      <label className="mb-2 block text-sm">Autor</label>
      <select
        value={autorActivo}
        onChange={(e) => onAutorChange(e.target.value)}
        className="mb-4 w-full rounded border border-slate-300 px-3 py-2"
      >
        <option value="">Todos</option>
        {autores.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      <label className="mb-2 block text-sm">Género</label>
      <select
        value={generoActivo}
        onChange={(e) => onGeneroChange(e.target.value)}
        className="mb-4 w-full rounded border border-slate-300 px-3 py-2"
      >
        <option value="">Todos</option>
        {generos.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <label className="mb-2 block text-sm">Año</label>
      <select
        value={anioActivo}
        onChange={(e) => onAnioChange(e.target.value)}
        className="mb-4 w-full rounded border border-slate-300 px-3 py-2"
      >
        <option value="">Todos</option>
        {anios.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <label className="mb-2 block text-sm">Disponibilidad</label>
      <select
        value={filtroEstado}
        onChange={(e) => onEstadoChange(e.target.value as 'Todos' | 'Disponible' | 'Prestado')}
        className="w-full rounded border border-slate-300 px-3 py-2"
      >
        <option value="Todos">Todos</option>
        <option value="Disponible">Disponibles</option>
        <option value="Prestado">Prestados</option>
      </select>
      <button
        type="button"
        onClick={onLimpiar}
        className="mt-4 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Limpiar filtros
      </button>
    </div>
  );
}

export default BookFilters;
