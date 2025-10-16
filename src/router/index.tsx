import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import UsuariosTable from "../administrator/pages_administrator/usuarios";
import { Sidebar } from "../administrator/Sidebar";

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
        path: "usuarios",
        element: <UsuariosTable />,
      },
      {
        path: "sidebar",
        element: <Sidebar />,
      },
    ],
  },
]);
