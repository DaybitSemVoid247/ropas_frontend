import { createBrowserRouter } from "react-router-dom";
import Usuario from "../administrator/pages_administrator/usuarios";
import { RootLayout } from "../layouts/RootLayout";
import { RootAdmin } from "../administrator/RootAdmin";
import { Sidebar } from "../administrator/Sidebar";
import { Productos } from "../administrator/pages_administrator/Productos";
import { Estadisticas } from "../administrator/pages_administrator/estadisticas";
import { Pedidos } from "../administrator/pages_administrator/pedidos";
import { Diseñador } from "../administrator/pages_administrator/diseñador";
import InicioSesionUsuarios from "../components/commons/login";
import RegistroUsuarios from "../components/commons/form";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <div>inicio</div>,
      },
      {
        path: "productos",
        element: <div>productos</div>,
      },
      {
        path: "categorias",
        element: <div>categorias</div>,
      },
      {
        path: "/login",
        element: <InicioSesionUsuarios />,
      },
      {
        path: "/registro",
        element: <RegistroUsuarios />,
      },
    ],
  },
  {
    path: "/administrator",
    element: <RootAdmin />,
    children: [
      {
        path: "sidebar",
        element: <Sidebar />,
      },
      {
        path: "productos",
        element: <Productos />,
      },
      {
        path: "usuarios",
        element: <Usuario />,
      },
      {
        path: "estadisticas",
        element: <Estadisticas />,
      },
      {
        path: "pedidos",
        element: <Pedidos />,
      },
      {
        path: "diseñador",
        element: <Diseñador />,
      },
    ],
  },
]);
