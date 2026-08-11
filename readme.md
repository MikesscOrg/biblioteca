# Biblioteca

Sistema de gestión de biblioteca desarrollado con React, TypeScript y Tailwind CSS.

## Descripción del proyecto

Biblioteca es una aplicación web pensada como MVP para gestionar un catálogo de libros de forma simple y visual. Permite agregar, editar, eliminar y filtrar libros, así como navegar entre el catálogo y la sección “Acerca del Proyecto”.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

## Instalación

```bash
npm install
```

## Ejecución local

```bash
npm run dev
```

## Build de producción

```bash
npm run build
```

## Despliegue en Vercel

El proyecto está preparado para desplegarse en Vercel como una app estática de Vite.

Pasos recomendados:

1. Conecta el repositorio en Vercel.
2. Usa el comando de build: `npm run build`.
3. El output se servirá desde la carpeta `dist`.

Una vez desplegado, el sitio quedará disponible a través de la URL pública que genere Vercel.

## Convención de estilos: mobile first

Este proyecto utiliza Tailwind CSS como framework principal para los estilos.

La convención de diseño es mobile first:
- Las clases base sin prefijo aplican a todos los tamaños de pantalla.
- Los prefijos `sm:`, `md:`, `lg:` y `xl:` se utilizan únicamente para ampliar el diseño en pantallas mayores.
- No se usan breakpoints `max-*` como estrategia por defecto.

En otras palabras, primero se diseña para pantallas pequeñas y luego se mejora progresivamente para tamaños mayores.

## Verificar Tailwind

1. Instala las dependencias con `npm install`.
2. Ejecuta `npm run dev` y abre la app en el navegador.
3. Comprueba que el ejemplo visual cambia de estilo al aumentar el ancho de la ventana.
4. Ejecuta `npm run build` para confirmar que no hay errores de compilación.
