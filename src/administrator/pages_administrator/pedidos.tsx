import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  talla: string;
}

export const Pedidos = () => {
  const productos: Producto[] = [
    {
      id: 1,
      nombre: "Camisa Formal",
      categoria: "Camisas",
      precio: 120.0,
      talla: "M",
    },
    {
      id: 2,
      nombre: "Pantalón Jean",
      categoria: "Pantalones",
      precio: 180.0,
      talla: "32",
    },
    {
      id: 3,
      nombre: "Vestido Casual",
      categoria: "Vestidos",
      precio: 250.0,
      talla: "S",
    },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("Todas");
  const categorias = [
    "Todas",
    ...Array.from(new Set(productos.map((p) => p.categoria))),
  ];
  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Catálogo de Productos</h2>

      <div className="flex gap-2 mb-6">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            onClick={() => setCategoriaSeleccionada(categoria)}
            className={`px-4 py-2 rounded-lg font-medium ${
              categoriaSeleccionada === categoria
                ? "bg-cyan-600 text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-800">
                {producto.nombre}
              </h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {producto.categoria}
              </span>
            </div>

            <p className="text-slate-600 text-sm mb-4">
              Talla: {producto.talla}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-cyan-600">
                Bs. {producto.precio.toFixed(2)}
              </span>
              <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pedidos;
