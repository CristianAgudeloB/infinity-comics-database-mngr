# Infinity Comics Database Manager

Interfaz de gestión para administrar series y cómics en la base de datos de Infinity Comics.

## Características

- ✅ Gestión completa de Series (crear, editar, eliminar, listar)
- ✅ Gestión completa de Comics (crear, editar, eliminar, listar)
- ✅ Interfaz moderna con la misma estética que Infinity Comics Web UI
- ✅ Soporte para múltiples URLs de descarga por cómic
- ✅ Soporte para lectura online (páginas)
- ✅ Validación de formularios
- ✅ Diseño responsive

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5174`

## Build

```bash
npm run build
```

## Estructura

```
src/
├── api/           # Cliente API para conectar con el backend
├── components/    # Componentes reutilizables
├── layouts/       # Layouts de la aplicación
├── pages/         # Páginas principales
├── router/        # Configuración de rutas
└── types/         # Tipos TypeScript
```

## Backend

Este proyecto se conecta al backend en:
`https://infinity-comics-library-mngr.onrender.com/api`

