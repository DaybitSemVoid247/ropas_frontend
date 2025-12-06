import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlineUser, HiMenu, HiX } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { navbarLinks } from "../../constants/links";
import { Logo } from "./Logo";

export const Navbar = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (usuarioActual) {
      setUsuario(JSON.parse(usuarioActual));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("token");
    setUsuario(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navbarLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                className={({ isActive }) =>
                  `relative text-sm font-semibold transition-colors duration-300 group tracking-wide ${
                    isActive
                      ? "text-cyan-600"
                      : "text-gray-700 hover:text-cyan-600"
                  }`
                }
              >
                {link.title}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center gap-4">
            {usuario ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {usuario.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-gray-900 tracking-wide">
                      {usuario.nombre}
                    </span>
                    <span className="text-xs text-gray-500 tracking-wide">
                      {usuario.rol}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transition-all duration-200 ease-out transform origin-top scale-100 opacity-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 tracking-wide">
                        {usuario.nombre}
                      </p>
                      <p className="text-xs text-gray-500 tracking-wide">
                        {usuario.correo}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 font-medium tracking-wide"
                    >
                      <FiLogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="w-10 h-10 rounded-full border-2 border-gray-700 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <HiOutlineUser size={20} />
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {mobileMenuOpen ? (
              <HiX size={24} className="text-gray-700" />
            ) : (
              <HiMenu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-out">
          <nav className="px-4 py-4 space-y-2">
            {navbarLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 tracking-wide ${
                    isActive
                      ? "bg-cyan-50 text-cyan-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {link.title}
              </NavLink>
            ))}
          </nav>

          {/* Mobile User Section */}
          <div className="px-4 py-4 border-t border-gray-200">
            {usuario ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {usuario.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 tracking-wide">
                      {usuario.nombre}
                    </span>
                    <span className="text-xs text-gray-500 tracking-wide">
                      {usuario.rol}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold flex items-center justify-center gap-2 tracking-wide"
                >
                  <FiLogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 font-semibold tracking-wide"
              >
                <HiOutlineUser size={20} />
                Iniciar Sesión
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
