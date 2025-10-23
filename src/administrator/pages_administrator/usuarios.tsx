import { useState, useEffect } from "react";
import { HiOutlineTrash, HiOutlinePencil, HiOutlinePlus } from "react-icons/hi";

interface Usuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  fecha_nacimiento: string;
  direccion: string;
  rol: string;
  contraseña: string;
}

export const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    fecha_nacimiento: "",
    direccion: "",
    rol: "",
    contraseña: "",
  });

  useEffect(() => {
    const usuariosInicial: Usuario[] = [
      {
        id: 1,
        nombre: "Gabo",
        apellido_paterno: "García",
        apellido_materno: "López",
        email: "gabi@gmail.com",
        fecha_nacimiento: "06-10-2002",
        direccion: "Achachicala, La Paz",
        rol: "Administrador",
        contraseña: "123456",
      },
      {
        id: 2,
        nombre: "Vlad",
        apellido_paterno: "III",
        apellido_materno: "De Valaquia",
        email: "vladelempalador@gmail.com",
        fecha_nacimiento: "30-12-1431",
        direccion: "Sighișoara, Romania",
        rol: "Administrador",
        contraseña: "1234567",
      },
    ];
    setUsuarios(usuariosInicial);
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      email: "",
      fecha_nacimiento: "",
      direccion: "",
      rol: "",
      contraseña: "",
    });
    setShowModal(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingId(usuario.id);
    setForm({
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      email: usuario.email,
      fecha_nacimiento: usuario.fecha_nacimiento,
      direccion: usuario.direccion,
      rol: usuario.rol,
      contraseña: usuario.contraseña || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    const usuariosActualizados = usuarios.filter((u) => u.id !== id);
    setUsuarios(usuariosActualizados);
  };

  const handleSave = () => {
    if (
      !form.nombre ||
      !form.apellido_paterno ||
      !form.apellido_materno ||
      !form.email ||
      !form.rol
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    let usuariosActualizados;

    if (editingId) {
      usuariosActualizados = usuarios.map((u) =>
        u.id === editingId ? { ...u, ...form } : u
      );
    } else {
      usuariosActualizados = [...usuarios, { id: Date.now(), ...form }];
    }

    setUsuarios(usuariosActualizados);
    setShowModal(false);
  };

  return (
    <div className="p-6">
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
              <th className="px-6 py-3">Apellido Paterno</th>
              <th className="px-6 py-3">Apellido Materno</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Fecha Nacimiento</th>
              <th className="px-6 py-3">Dirección</th>
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
                <td className="px-6 py-3">{usuario.apellido_paterno}</td>
                <td className="px-6 py-3">{usuario.apellido_materno}</td>
                <td className="px-6 py-3">{usuario.email}</td>
                <td className="px-6 py-3">{usuario.fecha_nacimiento}</td>
                <td className="px-6 py-3">{usuario.direccion}</td>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <input
                type="text"
                placeholder="Nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                placeholder="Apellido Paterno"
                value={form.apellido_paterno}
                onChange={(e) =>
                  setForm({ ...form, apellido_paterno: e.target.value })
                }
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                placeholder="Apellido Materno"
                value={form.apellido_materno}
                onChange={(e) =>
                  setForm({ ...form, apellido_materno: e.target.value })
                }
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="date"
                placeholder="Fecha de Nacimiento"
                value={form.fecha_nacimiento}
                onChange={(e) =>
                  setForm({ ...form, fecha_nacimiento: e.target.value })
                }
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <input
                type="text"
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) =>
                  setForm({ ...form, direccion: e.target.value })
                }
                className="px-3 py-2 border border-slate-300 rounded"
              />
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="px-3 py-2 border border-slate-300 rounded md:col-span-2"
              >
                <option value="">Seleccionar rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Recepcionista">Recepcionista</option>
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
