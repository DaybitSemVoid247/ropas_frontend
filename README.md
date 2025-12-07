# Tienda de Ropas (Frontend)

Aplicación web desarrollada con **React**, **TypeScript** y **Vite**, diseñada para consumir un backend con NestJS y mostrar una tienda de ropa funcional y administrable.

## Tecnologías utilizadas

- **React** – Biblioteca principal para la UI
- **TypeScript** – Tipado estático y mayor seguridad
- **Vite** – Bundler rápido para desarrollo y build
- **TailwindCSS** – Framework de CSS utilitario con JIT
- **React Router** – Manejo de rutas y navegación
- **React Icons** – Iconos listos para usar
- **ESLint + Prettier** – Para mantener código limpio y consistente
- **Axios** – Para llamadas HTTP al backend
- **React Query** – Manejo de estado de datos asincrónicos y caché
- **Framer Motion** – Animaciones suaves en UI
- **React Hook Form** – Validación y manejo de formularios de manera eficiente

## Instalación y ejecución

Clonar el repositorio:

```bash
git clone https://github.com/DaybitSemVoid247/ropas_frontend.git

cd ropas_frontend

npm install

npm run dev
```

**La aplicación estará disponible en http://localhost:5173 (Vite puede asignar otro puerto si el 5173 ya está en uso).**

**Configuración para Administrador**

**Para ingresar como administrador se requiere correo y contraseña proporcionados por el desarrollador o enviados por correo. La contraseña tiene formato alfanumérico según lo entregado. Ingresar estos datos en el formulario de login para acceder a la sección de administración, donde se pueden gestionar productos, categorías, subcategorías y usuarios.**

**Asegúrate de que el backend esté corriendo en http://localhost:3000 antes de iniciar el frontend para que todas las rutas y datos funcionen correctamente**

**Mantén actualizadas las dependencias para evitar conflictos entre librerías**

VITE_BACKEND_URL=http://localhost:3000
