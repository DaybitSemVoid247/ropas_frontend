import { useState } from "react";
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from "react-icons/hi";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: 1,
      nombre: "Gabo",
      email: "gabi@example.com",
      rol: "Administrador",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: "", email: "", rol: "" });

  const handleAdd = () => {
    setEditingId(null);
    setForm({ nombre: "", email: "", rol: "" });
    setShowModal(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setForm({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  const handleSave = () => {
    if (!form.nombre || !form.email || !form.rol) return;

    if (editingId) {
      setUsuarios(
        usuarios.map((u) => (u.id === editingId ? { ...u, ...form } : u))
      );
    } else {
      setUsuarios([...usuarios, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
        >
          <HiOutlinePlus size={18} />
          Agregar
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-200 font-semibold">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Rol</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr
                key={usuario.id}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-6 py-3">{usuario.nombre}</td>
                <td className="px-6 py-3">{usuario.email}</td>
                <td className="px-6 py-3">{usuario.rol}</td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <HiOutlinePencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="text-red-600 hover:text-red-800"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded"
              >
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Mesero">Mesero</option>
                <option value="Chef">Chef</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-3 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
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

export default UsuariosTable;
