# AutoTools App

Aplicación web para la gestión interna de una distribuidora de autopartes. Permite a los empleados consultar inventario, generar reportes y administrar usuarios, con control de acceso basado en roles.

## Stack

- **React 19** + **Vite 8**
- **TypeScript 5** — tipado estático estricto (`strict: true`)
- **React Router DOM v7** — enrutamiento client-side
- **Context API** — manejo de autenticación y sesión
- **CSS Modules** — estilos por componente

## Requisitos previos

- **Node.js** v18 o superior
- **npm** v9 o superior

Verifica tus versiones con:

```bash
node -v
npm -v
```

## Estructura del proyecto

```
src/
├── components/
│   ├── features/       # Componentes de dominio
│   ├── layout/         # Estructura general (navbar, sidebar, etc.)
│   └── ui/             # Componentes reutilizables (botones, inputs, etc.)
├── context/
│   └── AuthContext.tsx # Autenticación y sesión con localStorage
├── data/
│   ├── productos.json  # Catálogo de productos (mock)
│   └── usuarios.json   # Usuarios del sistema (mock)
├── pages/
│   ├── Home.tsx        # Landing pública
│   ├── Login.tsx       # Inicio de sesión
│   ├── Search.tsx      # Búsqueda de productos
│   └── dashboard/
│       ├── Inventory.tsx  # Gestión de inventario (privado)
│       ├── Reports.tsx    # Reportes (privado)
│       └── Users.tsx      # Administración de usuarios (solo admin)
├── router/
│   └── index.tsx       # Rutas con guards de autenticación y rol
├── types/
│   └── index.ts        # Tipos globales: Usuario, Producto, AuthContext
└── vite-env.d.ts       # Declaraciones de módulos (CSS, assets)
```

## Rutas

| Ruta                    | Acceso         | Descripción                        |
|-------------------------|----------------|------------------------------------|
| `/`                     | Público        | Página de inicio                   |
| `/login`                | Público        | Inicio de sesión                   |
| `/busqueda`             | Público        | Búsqueda de productos              |
| `/dashboard/inventario` | Autenticado    | Gestión de inventario              |
| `/dashboard/reportes`   | Autenticado    | Reportes del sistema               |
| `/dashboard/usuarios`   | Solo `admin`   | Administración de usuarios         |

## Roles

| Rol          | Permisos                                         |
|--------------|--------------------------------------------------|
| `admin`      | Acceso completo, incluyendo gestión de usuarios  |
| `trabajador` | Acceso a inventario y reportes                   |

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Verificar tipos sin compilar
npm run typecheck

# Build de producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## Credenciales de prueba

La contraseña para todos los usuarios es `1234`.

| Nombre       | Correo                        | Rol         |
|--------------|-------------------------------|-------------|
| Elena Rojas  | elena.r@autotools.com         | admin       |
| Ana Torres   | ana.torres@autotools.com      | trabajador  |
| Luis Gómez   | luis.gomez@autotools.com      | trabajador  |

> **Nota:** Los datos (usuarios y productos) son mocks estáticos en archivos JSON dentro de `src/data/`.

