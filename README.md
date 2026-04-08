# Technova React

Aplicación web construida con Vite, React y React Router. El proyecto tiene una base modular preparada para componentes reutilizables, páginas, contexto, hooks y servicios.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

1. Clona el repositorio.
2. Instala las dependencias:

<pre><code>npm install</code></pre>

## Ejecución

Para levantar el entorno de desarrollo:

<pre><code>npm run dev</code></pre>

Vite mostrará una URL local, normalmente en:

<pre><code>http://localhost:5173</code></pre>

## Scripts disponibles

- <strong>npm run dev</strong>: inicia el servidor de desarrollo.
- <strong>npm run build</strong>: genera la versión optimizada para producción.
- <strong>npm run preview</strong>: previsualiza la versión generada con build.
- <strong>npm run lint</strong>: ejecuta ESLint sobre el proyecto.

## Estructura del proyecto

- <strong>src/components/ui</strong>: componentes visuales compartidos, como Header y Footer.
- <strong>src/pages</strong>: páginas de la aplicación.
- <strong>src/context</strong>: contexto global de la app.
- <strong>src/hooks</strong>: hooks personalizados.
- <strong>src/services</strong>: lógica de acceso a datos o integraciones externas.
- <strong>src/data/productos.json</strong>: datos locales de ejemplo.

## Tecnologías

- React 19
- React Router
- Vite
- ESLint
- Font Awesome

## Notas

La aplicación se encuentra en una fase inicial y actualmente monta un layout base con Header, ruta principal y Footer.
