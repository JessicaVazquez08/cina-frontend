import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";

import { useCarrito } from "../context/CarritoContext";

import "../styles/carrito.css";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const API_ORIGIN = API_URL?.replace(/\/api$/, "");

const obtenerImagen = (imagenUrl) => {
  if (!imagenUrl) return null;

  if (imagenUrl.startsWith("http")) {
    return imagenUrl;
  }

  return `${API_ORIGIN}${imagenUrl.startsWith("/") ? "" : "/"}${imagenUrl}`;
};

function Carrito() {
  const navigate = useNavigate();

  const {
    items,
    totalArticulos,
    total,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  } = useCarrito();

  const continuarCompra = () => {
    navigate("/datos-compra");
  };

  return (
    <div className="carrito-page">
      <header className="carrito-header">
        <button className="carrito-back" onClick={() => navigate("/catalogo")}>
          <ArrowLeft size={18} />
          Seguir comprando
        </button>

        <h1>Carrito de compras</h1>

        <p>Revisa tus productos antes de continuar con tu compra.</p>
      </header>

      {items.length === 0 ? (
        <div className="carrito-vacio">
          <div className="carrito-vacio-icon">
            <ShoppingCart size={48} />
          </div>

          <h2>Tu carrito está vacío</h2>

          <p>
            Parece que todavía no has agregado productos. Explora nuestro
            catálogo y encuentra lo que necesitas.
          </p>

          <button onClick={() => navigate("/catalogo")}>
            <ShoppingBag size={18} />
            Explorar catálogo
          </button>
        </div>
      ) : (
        <div className="carrito-layout">
          {/* LISTA DE PRODUCTOS */}

          <section className="carrito-productos">
            <div className="carrito-productos-header">
              <div>
                <h2>Mis productos</h2>
                <span>{totalArticulos} artículos en tu carrito</span>
              </div>

              <button
                className="carrito-vaciar"
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Deseas eliminar todos los productos del carrito?",
                    )
                  ) {
                    vaciarCarrito();
                  }
                }}
              >
                Vaciar carrito
              </button>
            </div>

            <div className="carrito-lista">
              {items.map((item) => {
                const imagen = obtenerImagen(item.imagenUrl);

                return (
                  <article className="carrito-item" key={item.id}>
                    <div className="carrito-item-imagen">
                      {imagen ? (
                        <img
                          src={imagen}
                          alt={item.nombre}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <ShoppingBag size={35} />
                      )}
                    </div>

                    <div className="carrito-item-info">
                      <span className="carrito-item-marca">
                        {item.marca || "CINA Wellness"}
                      </span>

                      <h3>{item.nombre}</h3>

                      <p>
                        {item.descripcion || "Producto de nuestro catálogo"}
                      </p>

                      <span className="carrito-item-stock">
                        {item.stock} unidades disponibles
                      </span>
                    </div>

                    <div className="carrito-item-control">
                      <span className="carrito-item-precio">
                        ${Number(item.precio).toFixed(2)}
                      </span>

                      <div className="carrito-cantidad">
                        <button
                          aria-label="Disminuir cantidad"
                          disabled={item.cantidad <= 1}
                          onClick={() =>
                            cambiarCantidad(item.id, item.cantidad - 1)
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.cantidad}</span>

                        <button
                          aria-label="Aumentar cantidad"
                          disabled={item.cantidad >= item.stock}
                          onClick={() =>
                            cambiarCantidad(item.id, item.cantidad + 1)
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="carrito-item-subtotal">
                        Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
                      </span>

                      <button
                        className="carrito-eliminar"
                        onClick={() => eliminarDelCarrito(item.id)}
                      >
                        <Trash2 size={15} />
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              className="carrito-continuar-comprando"
              onClick={() => navigate("/catalogo")}
            >
              <ArrowLeft size={17} />
              Continuar comprando
            </button>
          </section>

          {/* RESUMEN */}

          <aside className="carrito-resumen">
            <h2>Resumen de compra</h2>

            <div className="carrito-resumen-articulos">
              <ShoppingBag size={19} />
              <span>{totalArticulos} artículos</span>
            </div>

            <div className="carrito-resumen-detalles">
              {items.map((item) => (
                <div className="carrito-resumen-item" key={item.id}>
                  <span>
                    {item.nombre} × {item.cantidad}
                  </span>

                  <strong>${(item.precio * item.cantidad).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="carrito-resumen-linea">
              <span>Subtotal</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <div className="carrito-resumen-linea">
              <span>Descuento</span>
              <strong>$0.00</strong>
            </div>

            <div className="carrito-resumen-linea">
              <span>Envío</span>
              <strong className="carrito-envio-gratis">Gratis</strong>
            </div>

            <div className="carrito-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <button className="carrito-finalizar" onClick={continuarCompra}>
              Continuar
            </button>

            <div className="carrito-seguridad">
              <PackageCheck size={20} />

              <p>Tu pedido será preparado una vez confirmada la compra.</p>
            </div>

            <p className="carrito-nota">
              Compra de demostración. No se realizará ningún cobro real.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Carrito;
