export default function Footer() {
  return (
    <footer className="bg-cafe-oscuro px-4 py-5 text-dorado sm:px-6 sm:py-6">
      <div className="mx-auto max-w-6xl text-center text-sm leading-6">
        © {new Date().getFullYear()} Sistema de Biblioteca
      </div>
    </footer>
  )
}
