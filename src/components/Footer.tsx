import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-cafe-oscuro text-dorado px-6 py-6">
      <div className="mx-auto max-w-6xl text-center text-sm">
        © {new Date().getFullYear()} Sistema de Biblioteca
      </div>
    </footer>
  )
}
