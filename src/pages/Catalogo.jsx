import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Plus, Minus, Trash2, Info } from "lucide-react";

import { obtenerProductos } from "../services/inventarioService";
import { useCarrito } from "../context/CarritoContext";
import DetalleProductoModal from "../components/DetalleProductoModal";
import "../styles/catalogo.css";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const API_ORIGIN = API_URL?.replace(/\/api$/, "");

function obtenerImagen(imagenUrl) {
  if (!imagenUrl) return "";

  if (imagenUrl.startsWith("http")) {
    return imagenUrl;
  }

  return `${API_ORIGIN}${imagenUrl}`;
}

function Catalogo() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [marcaActiva, setMarcaActiva] = useState("Todas");
  const [productoDetalle, setProductoDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const {
    items,
    total,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
  } = useCarrito();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setError("");
        const data = await obtenerProductos();
        setProductos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar el catálogo:", err);
        setError("No fue posible cargar los productos. Intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  const marcas = useMemo(() => {
    const nombres = productos
      .map((producto) => producto.marca?.nombre)
      .filter(Boolean);

    return ["Todas", ...new Set(nombres)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideMarca =
        marcaActiva === "Todas" || producto.marca?.nombre === marcaActiva;

      const coincideBusqueda =
        !termino ||
        producto.nombre?.toLowerCase().includes(termino) ||
        producto.descripcion?.toLowerCase().includes(termino) ||
        producto.marca?.nombre?.toLowerCase().includes(termino);

      return coincideMarca && coincideBusqueda;
    });
  }, [productos, busqueda, marcaActiva]);

  const formatoPrecio = (precio) =>
    Number(precio || 0).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

  const agregarProducto = (producto) => {
    const resultado = agregarAlCarrito(producto);

    if (!resultado.ok) {
      alert(resultado.mensaje);
    }
  };

  return (
    <div className="catalogo-page">
      <header className="catalogo-topbar">
        <div className="catalogo-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="catalogo-user">
          <span className="catalogo-bell">♧</span>
          <span>Hola, Cliente</span>
        </div>
      </header>

      <div className="catalogo-layout">
        <main className="catalogo-main">
          <div className="catalogo-heading">
            <h1>Tienda CINA</h1>
            <p>Productos para el cuidado de tus pies y manos</p>
          </div>

          <div className="catalogo-filters">
            {marcas.map((marca) => (
              <button
                key={marca}
                type="button"
                className={marcaActiva === marca ? "active" : ""}
                onClick={() => setMarcaActiva(marca)}
              >
                {marca}
              </button>
            ))}
          </div>

          {error && <p className="catalogo-error">{error}</p>}

          {cargando ? (
            <p className="catalogo-message">Cargando productos...</p>
          ) : productosFiltrados.length === 0 ? (
            <div className="catalogo-empty">
              <Info size={30} />
              <p>No encontramos productos con esos criterios.</p>
            </div>
          ) : (
            <div className="catalogo-grid">
              {productosFiltrados.map((producto) => {
                const stock = Number(producto.stock || 0);
                const imagen = obtenerImagen(producto.imagenUrl);

                return (
                  <article className="catalogo-card" key={producto.id}>
                    <button
                      type="button"
                      className="catalogo-card-image catalogo-card-image-button"
                      onClick={() => setProductoDetalle(producto)}
                      aria-label={`Ver detalle de ${producto.nombre}`}
                    >
                      {imagen ? (
                        <img
                          src={imagen}
                          alt={producto.nombre}
                          loading="lazy"
                        />
                      ) : (
                        <div className="catalogo-no-image">
                          <ShoppingCart size={34} />
                          <span>Imagen no disponible</span>
                        </div>
                      )}
                    </button>

                    <div className="catalogo-card-content">
                      <span className="catalogo-card-brand">
                        {producto.marca?.nombre || "CINA Wellness"}
                      </span>

                      <button
                        type="button"
                        className="catalogo-card-title"
                        onClick={() => setProductoDetalle(producto)}
                      >
                        {producto.nombre}
                      </button>

                      <p className="catalogo-card-description">
                        {producto.descripcion || "Producto para tu bienestar."}
                      </p>

                      <strong className="catalogo-card-price">
                        {formatoPrecio(producto.precioActual)}
                      </strong>

                      <span
                        className={`catalogo-card-stock ${
                          stock <= 0 ? "out" : ""
                        }`}
                      >
                        {stock > 0 ? `Stock: ${stock}` : "Agotado"}
                      </span>

                      <button
                        type="button"
                        className="catalogo-add-button"
                        disabled={stock <= 0}
                        onClick={() => agregarProducto(producto)}
                      >
                        <ShoppingCart size={17} />
                        Agregar al carrito
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {/* CARRITO LATERAL */}
        <aside className="catalogo-cart-panel">
          <div className="catalogo-cart-heading">
            <h2>
              <ShoppingCart size={22} />
              Carrito de compras
            </h2>
            <span>{items.length}</span>
          </div>

          {items.length === 0 ? (
            <div className="catalogo-cart-empty">
              <ShoppingCart size={34} />
              <p>Tu carrito está vacío.</p>
              <small>Agrega productos para comenzar tu compra.</small>
            </div>
          ) : (
            <>
              <div className="catalogo-cart-items">
                {items.map((item) => (
                  <div className="catalogo-cart-item" key={item.id}>
                    <div className="catalogo-cart-image">
                      {item.imagenUrl ? (
                        <img
                          src={obtenerImagen(item.imagenUrl)}
                          alt={item.nombre}
                        />
                      ) : (
                        <ShoppingCart size={20} />
                      )}
                    </div>

                    <div className="catalogo-cart-info">
                      <strong>{item.nombre}</strong>
                      <span>{formatoPrecio(item.precio)}</span>

                      <div className="catalogo-quantity">
                        <button
                          type="button"
                          aria-label="Disminuir cantidad"
                          onClick={() =>
                            cambiarCantidad(item.id, item.cantidad - 1)
                          }
                        >
                          <Minus size={13} />
                        </button>

                        <span>{item.cantidad}</span>

                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          disabled={item.cantidad >= item.stock}
                          onClick={() =>
                            cambiarCantidad(item.id, item.cantidad + 1)
                          }
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="catalogo-cart-subtotal">
                      <strong>
                        {formatoPrecio(item.precio * item.cantidad)}
                      </strong>

                      <button
                        type="button"
                        title="Eliminar producto"
                        onClick={() => eliminarDelCarrito(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="catalogo-cart-summary">
                <div>
                  <span>Productos ({items.length})</span>
                  <strong>{formatoPrecio(total)}</strong>
                </div>

                <div className="catalogo-cart-total">
                  <span>Total</span>
                  <strong>{formatoPrecio(total)}</strong>
                </div>

                <button
                  type="button"
                  className="catalogo-checkout-button"
                  onClick={() => navigate("/carrito")}
                >
                  Ver carrito
                </button>

                <div className="catalogo-cart-notice">
                  <Info size={17} />
                  <span>
                    Tu selección se conserva mientras navegas por CINA Wellness.
                  </span>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* MODAL DE DETALLE */}
      {productoDetalle && (
        <DetalleProductoModal
          producto={productoDetalle}
          onClose={() => setProductoDetalle(null)}
        />
      )}
    </div>
  );
}

export default Catalogo;
