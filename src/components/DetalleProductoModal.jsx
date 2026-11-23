import { useEffect, useState } from "react";

import { ShoppingCart, Plus, Minus, X, Package } from "lucide-react";

import { useCarrito } from "../context/CarritoContext";
import { obtenerImagenProducto } from "../utils/imagenProducto";

import "../styles/detalleProductoModal.css";

function DetalleProductoModal({ producto, onClose }) {
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const { items, agregarAlCarrito } = useCarrito();

  const stock = Number(producto.stock || 0);

  const cantidadEnCarrito =
    items.find((item) => item.id === producto.id)?.cantidad || 0;

  const stockDisponible = Math.max(0, stock - cantidadEnCarrito);

  const precio = Number(producto.precioActual || 0);

  const imagen = obtenerImagenProducto(producto.imagenUrl);

  useEffect(() => {
    setCantidad(1);
    setMensaje("");
  }, [producto.id]);

  const cambiarCantidad = (valor) => {
    const nuevaCantidad = cantidad + valor;

    if (nuevaCantidad < 1 || nuevaCantidad > stockDisponible) {
      return;
    }

    setCantidad(nuevaCantidad);
    setMensaje("");
  };

  const agregarProducto = () => {
    if (cantidad > stockDisponible || stockDisponible <= 0) {
      setMensaje("No hay suficientes existencias disponibles.");
      return;
    }

    const resultado = agregarAlCarrito(producto, cantidad);

    if (!resultado.ok) {
      setMensaje(resultado.mensaje);
      return;
    }

    onClose();
  };

  const formatoPrecio = (valor) =>
    valor.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

  return (
    <div className="detalle-producto-overlay" onClick={onClose}>
      <section
        className="detalle-producto-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalle-producto-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="detalle-producto-close"
          onClick={onClose}
          aria-label="Cerrar detalle del producto"
        >
          <X size={21} />
        </button>

        <div className="detalle-producto-header">
          <h2>Detalle del producto</h2>
          <p>Catálogo / {producto.marca?.nombre || "Productos"}</p>
        </div>

        <div className="detalle-producto-layout">
          {/* FOTOGRAFÍA */}
          <div className="detalle-producto-image-section">
            <div className="detalle-producto-image">
              {imagen ? (
                <img
                  src={imagen}
                  alt={producto.nombre}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="detalle-producto-no-image">
                  <Package size={55} />
                  <span>Imagen no disponible</span>
                </div>
              )}
            </div>

            <span
              className={`detalle-producto-status ${
                stockDisponible <= 0 ? "agotado" : ""
              }`}
            >
              {stockDisponible > 0 ? "Disponible" : "Agotado"}
            </span>
          </div>

          {/* INFORMACIÓN */}
          <div className="detalle-producto-information">
            <span className="detalle-producto-brand">
              {producto.marca?.nombre || "CINA Wellness"}
            </span>

            <h3 id="detalle-producto-titulo">{producto.nombre}</h3>

            <strong className="detalle-producto-price">
              {formatoPrecio(precio)}
            </strong>

            <div className="detalle-producto-description">
              <p>
                {producto.descripcion ||
                  "Producto para el cuidado y bienestar de tus pies y manos."}
              </p>
            </div>

            <div className="detalle-producto-stock">
              <Package size={17} />

              <span>
                {stockDisponible > 0
                  ? `Existencia disponible: ${stockDisponible} piezas`
                  : "No hay existencias disponibles"}
              </span>
            </div>

            <div className="detalle-producto-quantity">
              <label>Cantidad</label>

              <div className="detalle-producto-quantity-control">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(-1)}
                  disabled={cantidad <= 1}
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>

                <span>{cantidad}</span>

                <button
                  type="button"
                  onClick={() => cambiarCantidad(1)}
                  disabled={cantidad >= stockDisponible}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="detalle-producto-subtotal">
              <span>Subtotal</span>
              <strong>{formatoPrecio(precio * cantidad)}</strong>
            </div>

            {mensaje && <p className="detalle-producto-error">{mensaje}</p>}

            <button
              type="button"
              className="detalle-producto-add"
              onClick={agregarProducto}
              disabled={stockDisponible <= 0}
            >
              <ShoppingCart size={18} />
              Agregar al carrito
            </button>

            <button
              type="button"
              className="detalle-producto-back"
              onClick={onClose}
            >
              Volver al catálogo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DetalleProductoModal;
