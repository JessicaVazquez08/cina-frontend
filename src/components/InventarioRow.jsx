import { useEffect, useState } from "react";
import { obtenerLotes } from "../services/inventarioService";

import PrecioModal from "./PrecioModal.jsx";

import {
  ArrowIcon,
  EditIcon,
  BoxIcon,
  MoneyIcon,
  UpRow,
  DownRow,
} from "./Icons.jsx";

function InventarioRow({
  producto,
  refresh,
  activeRow,
  setActiveRow,
  onRegistrarLote,
  onEditarProducto,
}) {
  const [showPrecios, setShowPrecios] = useState(false);
  const [expand, setExpand] = useState(false);
  const [lotes, setLotes] = useState([]);

  const isOpen = activeRow === producto.id;

  const cargarLotes = async () => {
    try {
      const data = await obtenerLotes(producto.id);
      setLotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al consultar lotes:", error);
      alert("No fue posible consultar los lotes.");
    }
  };

  const toggleRow = () => {
    setActiveRow(isOpen ? null : producto.id);
  };

  const toggleDetalle = async () => {
    const nuevoEstado = !expand;
    setExpand(nuevoEstado);

    if (nuevoEstado) {
      await cargarLotes();
    }
  };

  useEffect(() => {
    if (expand) {
      cargarLotes();
    }
  }, [producto.stock]);

  return (
    <div className="inv-row-container">
      <div className="inv-row-viewport">
        {/* Flecha fija */}
        <div className="inv-row-toggle-slot">
          <button
            type="button"
            className="inv-toggle"
            onClick={toggleRow}
            aria-label={isOpen ? "Cerrar acciones" : "Abrir acciones"}
          >
            <ArrowIcon open={isOpen} />
          </button>
        </div>

        {/* Contenido deslizante */}
        <div className={`inv-row-track ${isOpen ? "is-open" : ""}`}>
          <div className="inv-row-main">
            <div className="inv-cell">
              <input value={producto.nombre || ""} disabled />
            </div>

            <div className="inv-cell">
              <input value={producto.descripcion || ""} disabled />
            </div>

            <div className="inv-cell">
              {producto.marca?.nombre || "Sin marca"}
            </div>

            <div className="inv-cell inv-cell-number">
              {producto.stock ?? 0}
            </div>

            <div className="inv-cell">
              <input type="number" value={producto.stockMinimo ?? 0} disabled />
            </div>
          </div>

          {/* Acciones */}
          <div className="inv-row-actions">
            <button
              type="button"
              title="Editar producto"
              onClick={() => onEditarProducto(producto)}
            >
              <EditIcon />
            </button>

            <button
              type="button"
              title="Registrar lote"
              onClick={() => onRegistrarLote(producto)}
            >
              <BoxIcon />
            </button>

            <button
              type="button"
              title="Administrar precios"
              onClick={() => setShowPrecios(true)}
            >
              <MoneyIcon />
            </button>

            <button
              type="button"
              title={expand ? "Ocultar lotes" : "Consultar lotes"}
              onClick={toggleDetalle}
            >
              {expand ? <UpRow /> : <DownRow />}
            </button>
          </div>
        </div>
      </div>

      {/* Detalle de lotes */}
      {isOpen && expand && (
        <div className="inv-row-details">
          <h4>Lotes de {producto.nombre}</h4>

          {lotes.length > 0 ? (
            <div className="inv-lote-scroll">
              <table className="inv-lote-table">
                <thead>
                  <tr>
                    <th>Lote</th>
                    <th>Stock</th>
                    <th>Fecha de entrada</th>
                    <th>Caducidad</th>
                    <th>Precio de compra</th>
                  </tr>
                </thead>

                <tbody>
                  {lotes.map((lote) => (
                    <tr key={lote.id}>
                      <td>{lote.numeroLote}</td>
                      <td>{lote.stockActual}</td>
                      <td>{lote.fechaEntrada || "-"}</td>
                      <td>{lote.fechaCaducidad || "-"}</td>
                      <td>${Number(lote.precioCompra || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="inv-message">
              Este producto no tiene lotes con existencias disponibles.
            </p>
          )}
        </div>
      )}

      {showPrecios && (
        <PrecioModal
          producto={producto}
          onClose={() => setShowPrecios(false)}
        />
      )}
    </div>
  );
}

export default InventarioRow;
