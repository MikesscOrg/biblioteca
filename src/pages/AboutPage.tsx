import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function AboutPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Acerca del Proyecto
        </p>
        <h1 className="mb-4 text-3xl font-semibold text-slate-900">Sistema de Biblioteca</h1>
        <p className="mb-6 text-lg text-slate-700">
          Esta aplicación permite gestionar un catálogo de libros, visualizar su disponibilidad y
          practicar las bases de desarrollo con React, TypeScript y Tailwind CSS.
        </p>

        <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-2">
          <div>
            <h2 className="mb-2 font-semibold text-slate-900">Tecnologías utilizadas</h2>
            <ul className="list-disc space-y-1 pl-5 text-slate-700">
              <li>React</li>
              <li>TypeScript</li>
              <li>Vite</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-slate-900">Detalles del desarrollo</h2>
            <ul className="space-y-1 text-slate-700">
              <li><span className="font-medium">Desarrollador:</span> Matías</li>
              <li><span className="font-medium">Año:</span> 2026</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex rounded bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-800"
          >
            Volver al catálogo
          </Link>
        </div>
      </section>
    </Layout>
  );
}
