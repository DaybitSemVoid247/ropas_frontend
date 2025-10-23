import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoLocationSharp } from "react-icons/io5";

interface FormData {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo_electronico: string;
  fecha_nacimiento: string;
  direccion: string;
  contraseña: string;
  confirmarContraseña: string;
}

export default function RegistroUsuarios() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
    fecha_nacimiento: "",
    direccion: "",
    contraseña: "",
    confirmarContraseña: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.contraseña !== formData.confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const usuariosGuardados = localStorage.getItem("usuarios");
    const usuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    const nuevoUsuario = {
      id: Date.now(),
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      email: formData.correo_electronico,
      fecha_nacimiento: formData.fecha_nacimiento,
      direccion: formData.direccion,
      contraseña: formData.contraseña,
      rol: "Usuario",
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    setFormData({
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      correo_electronico: "",
      fecha_nacimiento: "",
      direccion: "",
      contraseña: "",
      confirmarContraseña: "",
    });

    alert("¡Registrado exitosamente! Ahora inicia sesión");
    navigate("/login");
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div
        className="w-full max-w-4xl bg-amber-50 border-4 border-amber-900 shadow-lg p-8"
        style={{ borderRadius: "2px" }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-amber-900 mb-2">
            REGISTRO DE USUARIOS
          </h2>
          <div className="w-16 h-1 bg-cyan-600 mx-auto"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Apellido Paterno"
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaUser className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Apellido Materno"
              name="apellido_materno"
              value={formData.apellido_materno}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <FaEnvelope className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="email"
              placeholder="Correo Electrónico"
              name="correo_electronico"
              value={formData.correo_electronico}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <MdDateRange className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <IoLocationSharp className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="password"
              placeholder="Contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="flex items-center border-b-4 border-cyan-600 pb-3">
            <RiLockPasswordLine className="text-2xl text-cyan-600 mr-3 flex-shrink-0" />
            <input
              type="password"
              placeholder="Confirme Contraseña"
              name="confirmarContraseña"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder-amber-800 text-amber-950 font-medium"
              required
            />
          </div>

          <div className="md:col-span-2 flex justify-center pt-4">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-8 py-3 border-2 border-cyan-700 hover:bg-cyan-700 hover:shadow-lg transition-all font-bold text-lg"
              style={{ borderRadius: "2px" }}
            >
              REGISTRARSE
            </button>
          </div>
        </form>

        <p className="text-center mt-8 pt-6 border-t-2 border-amber-900 text-amber-900 font-semibold">
          ¿Ya tienes cuenta?
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-600 hover:text-cyan-700 font-bold hover:underline ml-2"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
}
