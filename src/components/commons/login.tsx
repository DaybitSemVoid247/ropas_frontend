import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

export default function InicioSesionUsuarios() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const usuariosGuardados = localStorage.getItem("usuarios");
    const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    const usuarioEncontrado = usuarios.find(
      (user: any) => user.email === correo
    );

    if (!usuarioEncontrado) {
      setError("Correo no registrado");
      setLoading(false);
      return;
    }

    if (usuarioEncontrado.contraseña !== contrasena) {
      setError("Contraseña incorrecta");
      setLoading(false);
      return;
    }

    setError("");
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioEncontrado));

    setTimeout(() => {
      setLoading(false);
      navigate("/administrator/usuarios");
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div
        className="w-full max-w-md bg-amber-50 border-4 border-amber-900 shadow-lg p-8"
        style={{ borderRadius: "2px" }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-2">
            INICIAR SESIÓN
          </h2>
          <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="flex items-center border-b-4 border-cyan-600 pb-3 bg-transparent">
              <MdOutlineMailOutline className="text-3xl text-cyan-600 mr-4 flex-shrink-0" />
              <input
                type="email"
                placeholder="Correo Electrónico"
                className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center border-b-4 border-cyan-600 pb-3 bg-transparent">
              <RiLockPasswordLine className="text-3xl text-cyan-600 mr-4 flex-shrink-0" />
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 p-3 text-red-800 font-semibold">
              {error}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 text-white px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg disabled:bg-gray-400 disabled:border-gray-500"
              style={{ borderRadius: "2px" }}
            >
              {loading ? "CARGANDO..." : "ENTRAR"}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-amber-900 text-center">
          <p className="text-amber-900 font-semibold">
            ¿No tienes cuenta?
            <button
              onClick={() => navigate("/registro")}
              className="text-cyan-600 hover:text-cyan-700 font-bold ml-2 hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
