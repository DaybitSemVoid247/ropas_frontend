import { useState, useEffect } from "react";

// Configuración de la API (igual que tu panel de admin)
const API_URL = "http://localhost:3000";

// Interfaces basadas en tu backend
interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface Subcategoria {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: Categoria;
  activo: boolean;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponibilidad?: number;
  imagen: string | null;
  subcategoria: Subcategoria;
  activo: boolean;
}

interface ProductoCarrito extends Producto {
  cantidad: number;
}

// Servicio API
const api = {
  async getProductos(): Promise<Producto[]> {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error("Error al cargar productos");
    return response.json();
  },

  async getCategorias(): Promise<Categoria[]> {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) throw new Error("Error al cargar categorías");
    return response.json();
  },
};

// Función helper para construir URLs de imágenes
const getImageUrl = (imagen: string | null): string => {
  if (!imagen) {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop";
  }
  if (imagen.startsWith("http")) {
    return imagen;
  }
  const filename = imagen.replace(/^\/uploads\/productos\//, "");
  return `${API_URL}/uploads/productos/${filename}`;
};

export default function TiendaProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [filtroCategoria, setFiltroCategoria] = useState<number | "todos">(
    "todos"
  );
  const [busqueda, setBusqueda] = useState<string>("");
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [mostrarCarrito, setMostrarCarrito] = useState<boolean>(false);
  const [mostrarModalQR, setMostrarModalQR] = useState<boolean>(false);

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar productos y categorías en paralelo
      const [productosData, categoriasData] = await Promise.all([
        api.getProductos(),
        api.getCategorias(),
      ]);

      // Filtrar solo productos activos y con stock disponible
      // Convertir precio y disponibilidad a números
      const productosActivos = productosData
        .filter((p) => p.activo && (Number(p.disponibilidad) || 0) > 0)
        .map((p) => ({
          ...p,
          precio: Number(p.precio),
          disponibilidad: Number(p.disponibilidad || 0),
        }));

      setProductos(productosActivos);
      setCategorias(categoriasData.filter((c) => c.activo));
    } catch (error: any) {
      console.error("Error al cargar datos:", error);
      setError(
        "No se pudieron cargar los productos. Verifica que el servidor esté funcionando."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos según búsqueda y categoría
  const productosFiltrados = productos.filter((producto) => {
    const cumpleBusqueda = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const cumpleCategoria =
      filtroCategoria === "todos" ||
      producto.subcategoria?.categoria?.id === filtroCategoria;

    return cumpleBusqueda && cumpleCategoria;
  });

  const agregarAlCarrito = (producto: Producto): void => {
    const productoExistente = carrito.find((item) => item.id === producto.id);

    if (productoExistente) {
      // Verificar que no exceda el stock disponible
      if (productoExistente.cantidad >= (producto.disponibilidad || 0)) {
        alert("No hay más stock disponible de este producto");
        return;
      }

      const nuevoCarrito = carrito.map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setCarrito(nuevoCarrito);
    } else {
      const nuevoItem: ProductoCarrito = {
        ...producto,
        cantidad: 1,
      };
      setCarrito([...carrito, nuevoItem]);
    }
  };

  const eliminarDelCarrito = (id: number): void => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  const aumentarCantidad = (id: number): void => {
    const producto = productos.find((p) => p.id === id);
    const itemCarrito = carrito.find((item) => item.id === id);

    if (
      itemCarrito &&
      producto &&
      itemCarrito.cantidad >= (producto.disponibilidad || 0)
    ) {
      alert("No hay más stock disponible de este producto");
      return;
    }

    const nuevoCarrito = carrito.map((item) =>
      item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
    );
    setCarrito(nuevoCarrito);
  };

  const disminuirCantidad = (id: number): void => {
    const producto = carrito.find((item) => item.id === id);
    if (producto && producto.cantidad === 1) {
      eliminarDelCarrito(id);
    } else {
      const nuevoCarrito = carrito.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      );
      setCarrito(nuevoCarrito);
    }
  };

  const totalCarrito: number = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const cantidadTotal: number = carrito.reduce(
    (sum, item) => sum + item.cantidad,
    0
  );

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      return;
    }

    // Mostrar modal con QR
    setMostrarModalQR(true);
  };

  const confirmarPago = () => {
    // Aquí puedes agregar la lógica para enviar la orden al backend
    setMostrarModalQR(false);
    setCarrito([]);
    setMostrarCarrito(false);
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Pantalla de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error de Conexión
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={cargarDatos}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Nuestra Colección
        </h1>

        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBusqueda(e.target.value)
              }
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
            />
          </div>
        </div>

        {/* Filtros de categoría */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <button
            onClick={() => setFiltroCategoria("todos")}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              filtroCategoria === "todos"
                ? "bg-gray-800 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todos
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setFiltroCategoria(categoria.id)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                filtroCategoria === categoria.id
                  ? "bg-gray-700 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl mb-2">
              No se encontraron productos
            </p>
            <p className="text-gray-400">
              Intenta con otra búsqueda o categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {producto.imagen ? (
                    <img
                      src={getImageUrl(producto.imagen)}
                      alt={producto.nombre}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const placeholder = document.createElement("div");
                          placeholder.className =
                            "w-full h-full flex flex-col items-center justify-center text-gray-400";
                          placeholder.innerHTML =
                            '<svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="mt-2 text-sm font-medium">Sin imagen</p>';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <svg
                        width="64"
                        height="64"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm font-medium">Sin imagen</p>
                    </div>
                  )}
                  {/* Badge de stock bajo */}
                  {(producto.disponibilidad || 0) <= 5 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      ¡Últimas unidades!
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {producto.nombre}
                  </h3>

                  {producto.descripcion && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {producto.descripcion}
                    </p>
                  )}

                  <div className="mb-3">
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                      {producto.subcategoria?.nombre}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      Bs {producto.precio.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Stock: {producto.disponibilidad || 0}
                    </p>
                  </div>

                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    disabled={(producto.disponibilidad || 0) === 0}
                    className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {(producto.disponibilidad || 0) === 0
                      ? "Sin Stock"
                      : "Agregar al Carrito"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante del carrito */}
      <button
        onClick={() => setMostrarCarrito(!mostrarCarrito)}
        className="fixed bottom-8 right-8 bg-gray-700 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
        {cantidadTotal > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cantidadTotal}
          </span>
        )}
      </button>

      {/* Panel del carrito */}
      {mostrarCarrito && (
        <div className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-2xl p-6 max-h-96 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío</p>
          ) : (
            <div>
              <div className="space-y-3 mb-4">
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{item.nombre}</p>
                      <p className="text-gray-600">
                        Bs {item.precio.toFixed(2)} c/u
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => disminuirCantidad(item.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-7 h-7 rounded flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => aumentarCantidad(item.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-7 h-7 rounded flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        Bs {(item.precio * item.cantidad).toFixed(2)}
                      </p>
                      <button
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold mt-1"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold mb-4">
                  <span>Total:</span>
                  <span>Bs {totalCarrito.toFixed(2)}</span>
                </div>
                <button
                  onClick={finalizarCompra}
                  className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de QR para pago */}
      {mostrarModalQR && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setMostrarModalQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              Escanea para pagar
            </h2>

            <div className="bg-gray-100 p-4 rounded-xl mb-4">
              <p className="text-center text-lg font-bold text-gray-900 mb-2">
                Total a pagar:
              </p>
              <p className="text-center text-3xl font-bold text-gray-800">
                Bs {totalCarrito.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              {/* Aquí va tu código QR - reemplaza el src con tu imagen */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TuCodigoQRAqui"
                alt="Código QR para pago"
                className="w-64 h-64 border-4 border-gray-200 rounded-lg"
              />
            </div>

            <p className="text-center text-gray-600 mb-6">
              Escanea el código QR con tu aplicación de pagos
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarModalQR(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarPago}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
