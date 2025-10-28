import { useState } from "react";
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from "react-icons/hi";

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  talla: string;
  stock: number;
}

export const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Camisa Formal",
      categoria: "Camisas",
      precio: 120.0,
      talla: "M",
      stock: 15,
    },
    {
      id: 2,
      nombre: "Pantalón Jean",
      categoria: "Pantalones",
      precio: 180.0,
      talla: "32",
      stock: 22,
    },
    {
      id: 3,
      nombre: "Vestido Casual",
      categoria: "Vestidos",
      precio: 250.0,
      talla: "S",
      stock: 8,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    talla: "",
    stock: "",
  });

  const handleAdd = () => {
    setEditingId(null);
    setForm({ nombre: "", categoria: "", precio: "", talla: "", stock: "" });
    setShowModal(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingId(producto.id);
    setForm({
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio.toString(),
      talla: producto.talla,
      stock: producto.stock.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (
      !form.nombre ||
      !form.categoria ||
      !form.precio ||
      !form.talla ||
      !form.stock
    )
      return;

    const productoData = {
      nombre: form.nombre,
      categoria: form.categoria,
      precio: parseFloat(form.precio),
      talla: form.talla,
      stock: parseInt(form.stock),
    };

    if (editingId) {
      setProductos(
        productos.map((p) =>
          p.id === editingId ? { ...p, ...productoData } : p
        )
      );
    } else {
      setProductos([...productos, { id: Date.now(), ...productoData }]);
    }
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Inventario de Ropa
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
        >
          <HiOutlinePlus size={18} />
          Agregar Producto
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-200 font-semibold">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3">Talla</th>
              <th className="px-6 py-3">Precio</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr
                key={producto.id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-6 py-3 font-medium">{producto.nombre}</td>
                <td className="px-6 py-3">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {producto.categoria}
                  </span>
                </td>
                <td className="px-6 py-3">{producto.talla}</td>
                <td className="px-6 py-3 font-semibold">
                  Bs. {producto.precio.toFixed(2)}
                </td>
                <td className="px-6 py-3">{producto.stock} unidades</td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleEdit(producto)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                    title="Editar"
                  >
                    <HiOutlinePencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              {editingId ? "Editar Producto" : "Nuevo Producto"}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  placeholder="Ej: Camisa Formal"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoría
                </label>
                <select
                  value={form.categoria}
                  onChange={(e) =>
                    setForm({ ...form, categoria: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="Camisas">Camisas</option>
                  <option value="Pantalones">Pantalones</option>
                  <option value="Vestidos">Vestidos</option>
                  <option value="Abrigos">Abrigos</option>
                  <option value="Faldas">Faldas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Talla
                </label>
                <input
                  type="text"
                  placeholder="S, M, L, XL..."
                  value={form.talla}
                  onChange={(e) => setForm({ ...form, talla: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Precio (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
