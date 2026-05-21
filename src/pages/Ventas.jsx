import { useEffect, useState, useRef } from "react";
import { crearVenta, buscarProductos } from "../services/ventaService";
import { DeleteIcon } from "../components/Icons.jsx";
import TicketModal from "../components/TicketModal";
import "../styles/ventas.css";

function Ventas() {

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indexActivo, setIndexActivo] = useState(-1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ventaGenerada, setVentaGenerada] = useState(null);
  const debounceRef = useRef(null);

  // =========================
  // AUTOCOMPLETE CON DEBOUNCE
  // =========================
  const buscar = (value) => {

    setBusqueda(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 2) {
      setResultados([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {

      setLoading(true);
      const data = await buscarProductos(value);
      setResultados(data);
      setLoading(false);
      setIndexActivo(-1);

    }, 400);
  };

  // =========================
  // AGREGAR PRODUCTO
  // =========================
  const agregarProducto = (p) => {

    if (p.stock <= 0) {
      alert("Sin stock disponible");
      return;
    }

    const existe = seleccionados.find(x => x.id === p.id);

    if (existe) {
      setSeleccionados(prev =>
        prev.map(x =>
          x.id === p.id
            ? { ...x, cantidad: x.cantidad + 1 }
            : x
        )
      );
    } else {
      setSeleccionados([
        ...seleccionados,
        {
          id: p.id,
          nombre: p.nombre,
          precio: p.precioActual,
          cantidad: 1,
          stock: p.stock
        }
      ]);
    }

    setBusqueda("");
    setResultados([]);
  };

  // =========================
  // TECLADO
  // =========================
  const handleKeyDown = (e) => {

    if (e.key === "ArrowDown") {
      setIndexActivo(prev =>
        prev < resultados.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      setIndexActivo(prev => (prev > 0 ? prev - 1 : 0));
    }

    if (e.key === "Enter" && indexActivo >= 0) {
      agregarProducto(resultados[indexActivo]);
    }
  };

  // =========================
  // CAMBIAR CANTIDAD
  // =========================
  const cambiarCantidad = (id, cantidad) => {

    setSeleccionados(prev =>
      prev.map(p => {

        if (p.id === id) {

          if (cantidad > p.stock) {
            alert("Stock insuficiente");
            return p;
          }

          return { ...p, cantidad: Number(cantidad) };
        }

        return p;
      })
    );
  };

  // =========================
  // TOTAL
  // =========================
  const total = seleccionados.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  // =========================
  // ELIMINAR PRODUCTO
  // =========================
  const eliminarProducto = (id) => {
    setSeleccionados(prev => prev.filter(p => p.id !== id));
  };

  // =========================
  // GUARDAR
  // =========================
  const guardar = async () => {

    if (!seleccionados.length) return;

    const detalles = seleccionados.map(p => ({
      producto: { id: p.id },
      cantidad: p.cantidad,
      precioVenta: p.precio
    }));

    await crearVenta(detalles);

    alert("Venta realizada");

    setSeleccionados([]);
  };

  return (
    <div className="pos-container">

      <h2>Ventas</h2>

      {/* BUSCADOR */}
      <input
        className="pos-search"
        placeholder="Buscar producto o marca..."
        value={busqueda}
        onChange={(e) => buscar(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {/* RESULTADOS */}
      <div className="pos-list">

        {loading && <div className="pos-loading">Buscando...</div>}

        {resultados.map((p, i) => (
          <div
            key={p.id}
            className={`pos-item ${i === indexActivo ? "active" : ""}`}
            onClick={() => agregarProducto(p)}
          >
            <div>
              <strong>{p.nombre}</strong>
              <div className="pos-sub">{p.marca?.nombre}</div>
            </div>

            <div className="pos-right">
              <span>${p.precioActual}</span>
              <span>Stock: {p.stock}</span>
            </div>
          </div>
        ))}

      </div>

      {/* CARRITO */}
      <div className="pos-cart">

        <h3>Detalle</h3>

        {seleccionados.map(p => (
          <div key={p.id} className="pos-cart-row">

          <span>{p.nombre}</span>

          <input
            type="number"
            value={p.cantidad}
            onChange={(e) =>
              cambiarCantidad(p.id, e.target.value)
            }
          />

          <span>${p.precio}</span>

          <span>${p.precio * p.cantidad}</span>

          {/* ICONO ELIMINAR */}
          <button
            className="pos-delete-btn"
            onClick={() => eliminarProducto(p.id)}
          >
            <DeleteIcon />
          </button>

        </div>
        ))}

        <h3>Total: ${total}</h3>

        <button className="pos-btn" onClick={() => setShowConfirm(true)}>
          Confirmar venta
        </button>
        {showConfirm && (
          <div className="pos-modal">
            <div className="pos-confirm">

              <h3>Confirmar venta</h3>
              <p>Total: ${total}</p>

              <button
                className="pos-btn"
                onClick={async () => {

                  const detalles = seleccionados.map(p => ({
                    producto: { 
                      id: p.id
                     },
                    cantidad: p.cantidad,
                    precioVenta: p.precio
                  }));

                  const venta = await crearVenta(detalles);
                  alert("venta:" + venta);
                  alert("seleccionados:" + seleccionados);
                  setVentaGenerada({
                    ...venta,
                    detalles: seleccionados
                  });

                  setSeleccionados([]);
                  setShowConfirm(false);
                }}
              >
                Confirmar
              </button>

              <button onClick={() => setShowConfirm(false)}>
                Cancelar
              </button>

            </div>
          </div>
        )}
        {ventaGenerada && (
          <TicketModal
            venta={ventaGenerada}
            onClose={() => setVentaGenerada(null)}
          />
        )}
      </div>

    </div>
  );
}

export default Ventas;