# Biblioteca

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
