# RAYSEG Inmobiliaria - Dashboard (Frontend)

> Panel de administración de RAYSEG: dashboard web construido con Next.js, TypeScript y Tailwind CSS.

> Proyecto orientado a la gestión de propiedades, agentes y clientes con componentes reutilizables y rutas organizadas en la carpeta `app/`.

## 🚀 Características

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS + `tailwind-merge`
- Zustand (estado) y @tanstack/react-query para fetch/caching
- Librerías de visualización: Chart.js, react-chartjs-2, recharts
- Componentes reutilizables en `components/` y rutas en `app/(root)/...`

## 📋 Requisitos Previos

- Node.js (recomendado >= 18)
- npm o yarn / pnpm
- Git

## 🛠️ Instalación y ejecución (desarrollo)

1. Clonar el repositorio

```bash
git clone <https://github.com/NovaaSystem/RAYSEG-gestor-inmobiliaria.git>
cd dashboard-rayseg-V1
```

2. Instalar dependencias

```bash
npm install
# o `yarn` / `pnpm install`
```

3. Levantar en modo desarrollo

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
# Abre http://localhost:3000
```

4. Producción (build)

```bash
npm run build
npm run start
```

5. Linter

```bash
npm run lint
```

## 🧭 Estructura del proyecto (resumen)

```
app/                    # Rutas (App Router). Cada carpeta equivale a una ruta.
  (root)/               # Layouts y páginas principales del dashboard
    property/           # Vistas relacionadas con propiedades
    agents/             # Vistas de agentes
    clients/            # Vistas de clientes
components/             # Componentes reutilizables (UI, widgets, Dashboard)
  ui/                   # Componentes atómicos (botones, selects, tablas...)
lib/                    # Helpers, hooks, links y utilidades
public/                 # Archivos estáticos
package.json
README.md
```

## ✅ Convenciones y recomendaciones

- Mantén en `app/` las páginas completas y la lógica específica de la ruta (fetching, composición de layout).
- Extrae a `components/` las piezas reutilizables (cards, formularios, tablas) cuando se usen en más de una pantalla.
- Nombra componentes y archivos de forma consistente: archivo `Xxx.tsx` exporta `Xxx`.
- Usa `components/ui` para elementos atómicos y `components/Feature` para grupos de componentes por dominio.

## 🧪 Tests

No hay tests configurados por defecto. Puedes añadir `vitest` o `jest` y agregar scripts en `package.json`.

## 📦 Despliegue

- Vercel: recomendado para aplicaciones Next.js. `build` command: `npm run build`.

## 🤝 Contribuir

- Fork del proyecto.
- Crea una rama para tu feature: `git checkout -b feature/mi-mejora`.
- Haz commits pequeños y descriptivos.
- Abre un Pull Request describiendo tu cambio.

## 📝 Licencia

Este repositorio no incluye un archivo `LICENSE`. Añade una licencia (por ejemplo MIT) si deseas permitir contribuciones externas con términos claros.

## 🆘 Soporte / Problemas comunes

- Si la app no arranca: verifica que Node y las dependencias están instaladas.
- Si hay problemas con imports: ejecuta `npm run build` y revisa mensajes de error.