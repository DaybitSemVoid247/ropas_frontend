import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaUser, FaEnvelope } from "react-icons/fa";
import axios from "axios";

interface FormData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [correoLogin, setCorreoLogin] = useState("");
  const [contrasenaLogin, setContrasenaLogin] = useState("");

  // Estados para el modal de verificación
  const [showModal, setShowModal] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [correoVerificacion, setCorreoVerificacion] = useState("");

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        correo: correoLogin,
        contrasena: contrasenaLogin,
      });

      const { usuario, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuarioActual", JSON.stringify(usuario));

      // 🆕 Guardar también en formato simple para la tienda
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.correo,
        })
      );

      console.log("Usuario actual:", usuario);

      const rutasPorRol: Record<string, string> = {
        Administrador: "/administrator/usuarios",
        Usuario: "/", // 🆕 Redirige a la tienda después del login
        Cocinero: "/pedidos",
        Cajero: "/cajero",
      };

      const rolAsignado = usuario.roles.find((rol: string) => rutasPorRol[rol]);

      if (rolAsignado) {
        navigate(rutasPorRol[rolAsignado]);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "Error al conectar con el servidor"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
      if (!soloLetras.test(value)) {
        setError(`El campo ${name} solo puede contener letras`);
        return;
      } else setError("");
    }

    setFormData({ ...formData, [name]: value });
  };

  const verificarCodigo = async () => {
    if (!codigo.trim()) {
      setError("Debes ingresar un código");
      return;
    }

    try {
      const API_URL = "http://localhost:3000/usuarios/verificar-codigo";

      const response = await axios.post(API_URL, {
        correo: correoVerificacion,
        codigo: codigo,
      });

      alert("Cuenta verificada correctamente, ahora puedes iniciar sesión");
      setShowModal(false);
      setCodigo("");
      setError("");
      setIsLogin(true);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al verificar el código");
      }
    }
  };

  const handleRegistro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(formData.nombre)) {
      setError("El nombre solo puede contener letras");
      return;
    }
    if (!soloLetras.test(formData.apellidoPaterno)) {
      setError("El apellido paterno solo puede contener letras");
      return;
    }
    if (!soloLetras.test(formData.apellidoMaterno)) {
      setError("El apellido materno solo puede contener letras");
      return;
    }
    if (formData.contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/usuarios", {
        correo: formData.correo,
        contrasena: formData.contrasena,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        rolesIds: [2],
      });

      setCorreoVerificacion(formData.correo);
      setShowModal(true);

      setFormData({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        contrasena: "",
        confirmarContrasena: "",
      });
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal de Verificación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-200">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-200 scale-100 opacity-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-cyan-500 rounded-full mx-auto flex items-center justify-center mb-4">
                <MdOutlineMailOutline className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verificación de Correo
              </h2>
              <p className="text-sm text-gray-600">
                Ingresa el código de 6 dígitos enviado a:
              </p>
              <p className="text-sm font-semibold text-cyan-600 mt-1">
                {correoVerificacion}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-r animate-[shake_0.4s_ease-in-out]">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full border-2 border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 p-3 rounded-lg mb-4 text-center text-xl tracking-widest font-semibold outline-none transition-all"
            />

            <button
              onClick={verificarCodigo}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Verificar Código
            </button>

            <button
              onClick={() => {
                setShowModal(false);
                setError("");
                setCodigo("");
              }}
              className="mt-3 w-full text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Contenedor Principal */}
      <div
        className="min-h-screen w-full flex items-center justify-center p-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/public/ropas.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Login Form */}
            {isLogin ? (
              <div className="transition-all duration-300 ease-out opacity-100 translate-y-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  ¡Bienvenido de nuevo!
                </h2>
                <p className="text-sm text-gray-500 mb-8 text-center"></p>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-r animate-[shake_0.4s_ease-in-out]">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdOutlineMailOutline
                          className="text-cyan-600"
                          size={18}
                        />
                      </div>
                      <input
                        type="email"
                        value={correoLogin}
                        onChange={(e) => setCorreoLogin(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockPasswordLine
                          className="text-cyan-600"
                          size={18}
                        />
                      </div>
                      <input
                        type="password"
                        value={contrasenaLogin}
                        onChange={(e) => setContrasenaLogin(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Cargando..." : "Iniciar Sesión"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <button
                      onClick={() => {
                        setIsLogin(false);
                        setError("");
                      }}
                      className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition-colors"
                    >
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* Register Form */
              <div className="transition-all duration-300 ease-out opacity-100 translate-y-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  Crear Cuenta
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                  Completa tus datos para registrarte
                </p>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-r animate-[shake_0.4s_ease-in-out]">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <form onSubmit={handleRegistro} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-cyan-600" size={16} />
                      </div>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Apellido Paterno
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-cyan-600" size={16} />
                      </div>
                      <input
                        type="text"
                        name="apellidoPaterno"
                        value={formData.apellidoPaterno}
                        onChange={handleChange}
                        placeholder="Apellido Paterno"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Apellido Materno
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-cyan-600" size={16} />
                      </div>
                      <input
                        type="text"
                        name="apellidoMaterno"
                        value={formData.apellidoMaterno}
                        onChange={handleChange}
                        placeholder="Apellido Materno"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-cyan-600" size={16} />
                      </div>
                      <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockPasswordLine
                          className="text-cyan-600"
                          size={16}
                        />
                      </div>
                      <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <RiLockPasswordLine
                          className="text-cyan-600"
                          size={16}
                        />
                      </div>
                      <input
                        type="password"
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? "Registrando..." : "Crear Cuenta"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <button
                      onClick={() => {
                        setIsLogin(true);
                        setError("");
                      }}
                      className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition-colors"
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
