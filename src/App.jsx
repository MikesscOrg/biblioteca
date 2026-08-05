const books = [
  { title: 'El principito', author: 'Antoine de Saint-Exupéry', year: 1943 },
  { title: '1984', author: 'George Orwell', year: 1949 },
  { title: 'Cien años de soledad', author: 'Gabriel García Márquez', year: 1967 },
]

function App() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl bg-white p-4 shadow-lg sm:p-6 lg:p-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
            Biblioteca
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Gestiona tus libros con una interfaz moderna
          </h1>
          <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
            Este ejemplo demuestra la convención mobile first: el contenido base se ve bien en pantallas pequeñas y los ajustes se aplican desde tamaños mayores.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Colección destacada</h2>
              <p className="text-sm text-slate-600">
                El bloque cambia de ancho y espaciado según el tamaño de pantalla.
              </p>
            </div>
            <div className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
              Diseño responsive
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <article key={book.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold">{book.title}</h3>
              <p className="text-sm text-slate-600">{book.author}</p>
              <p className="mt-2 text-sm text-slate-500">{book.year}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App
