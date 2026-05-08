# AutoTools App

Aplicación web para la gestión interna de una distribuidora de autopartes. Permite a los empleados consultar inventario, generar reportes y administrar usuarios, con control de acceso basado en roles.

> **Requisito:** Este frontend consume la API REST de [autotools-backend](https://github.com/j-illana/autotools-backend). Asegúrate de tenerlo corriendo antes de levantar el frontend.

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

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/j-illana/autotools.git
cd autotools

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de entorno
cp .env.example .env
```

Edita el `.env` con la URL de tu backend:

```env
VITE_API_URL=http://localhost:3000/api
```

Si el backend corre en otro puerto o host, actualiza ese valor.

```bash
# 4. Levantar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base de la API REST | `http://localhost:3000/api` |

## Estructura del proyecto

```
src/
├── api/
│   └── client.ts       # Wrapper de fetch con JWT automático
├── components/
│   ├── layout/         # DashboardLayout, sidebar, navbar
│   └── ui/             # Componentes reutilizables (modales, etc.)
├── context/
│   └── AuthContext.tsx # Autenticación y sesión con localStorage
├── pages/
│   ├── Home.tsx        # Landing pública con buscador
│   ├── Login.tsx       # Inicio de sesión
│   ├── Search.tsx      # Búsqueda pública de productos
│   └── dashboard/
│       ├── Inventory.tsx  # Gestión de inventario (privado)
│       ├── Reports.tsx    # Reportes del sistema (privado)
│       └── Users.tsx      # Administración de usuarios (solo admin)
├── router/
│   └── index.tsx       # Rutas con PrivateRoute y PublicRoute
├── types/
│   └── index.ts        # Tipos globales: User, Product, Role
└── vite-env.d.ts       # Tipos de variables de entorno Vite
```

## Rutas

| Ruta                    | Acceso         | Descripción                        |
|-------------------------|----------------|------------------------------------|
| `/`                     | Público        | Página de inicio con buscador      |
| `/login`                | Público        | Inicio de sesión                   |
| `/busqueda`             | Público        | Búsqueda de productos              |
| `/dashboard/inventario` | Autenticado    | Gestión de inventario              |
| `/dashboard/reportes`   | Autenticado    | Reportes del sistema               |
| `/dashboard/usuarios`   | Solo `admin`   | Administración de usuarios         |

## Roles

| Rol      | Permisos                                        |
|----------|-------------------------------------------------|
| `admin`  | Acceso completo, incluyendo gestión de usuarios |
| `worker` | Acceso a inventario y reportes                  |

## Credenciales de prueba

Los usuarios de prueba se crean con el seed del backend (`npm run seed:users`).

| Correo                        | Contraseña | Rol    |
|-------------------------------|------------|--------|
| joseph.illana.j@gmail.com     | admin123   | admin  |
| joseph.illana@outlook.com     | worker123  | worker |

## Comandos disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Lint con ESLint
npx tsc --noEmit   # Verificar tipos sin compilar
```
