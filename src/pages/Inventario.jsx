import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/inventarioService.js";
import GestionProductosModal from "../components/GestionProductosModal";
import InventarioRow from "../components/InventarioRow";
import LoteFormInline from "../components/LoteFormInline.jsx";
import "../styles/inventario.css";

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [productoLoteId, setProductoLoteId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // CARGAR PRODUCTOS
  const cargar = async () => {
    try {
      setError("");
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No fue posible cargar los productos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  // INDICADORES
  const totalProductos = productos.length;

  const totalExistencias = productos.reduce(
    (total, producto) => total + Number(producto.stock || 0),
    0,
  );

  const productosBajos = productos.filter((producto) => {
    const stock = Number(producto.stock || 0);
    const minimo = Number(producto.stockMinimo || 0);
    return stock <= minimo;
  }).length;

  // PRODUCTOS SELECCIONADOS
  const productoSeleccionado = productos.find(
    (producto) => producto.id === activeRow,
  );

  const productoParaLote = productos.find(
    (producto) => producto.id === productoLoteId,
  );

  // ABRIR FORMULARIO PARA NUEVO PRODUCTO
  const abrirNuevoProducto = () => {
    setProductoEditar(null);
    setShowModal(true);
  };

  // ABRIR FORMULARIO PARA EDITAR
  const abrirEdicionProducto = (producto) => {
    setProductoEditar(producto);
    setShowModal(true);
  };

  // CERRAR MODAL
  const cerrarModalProducto = () => {
    setShowModal(false);
    setProductoEditar(null);
  };

  // REGISTRO DE LOTES
  const abrirFormularioLote = (producto) => {
    setActiveRow(producto.id);
    setProductoLoteId(producto.id);
  };

  const cerrarFormularioLote = () => {
    setProductoLoteId(null);
  };

  return (
    <div className="inv-container">
      {/* ENCABEZADO */}
      <div className="inv-header">
        <div>
          <h2>Inventario</h2>
          <p>Administra los productos y las existencias de CINA Wellness.</p>
        </div>

        <button className="inv-btn" onClick={abrirNuevoProducto}>
          + Gestión de productos
        </button>
      </div>

      {/* INDICADORES */}
      <section className="inv-summary">
        <article className="inv-summary-card">
          <span className="inv-summary-label">Productos registrados</span>
          <strong>{totalProductos}</strong>
          <span className="inv-summary-description">
            Productos en el catálogo
          </span>
        </article>

        <article className="inv-summary-card">
          <span className="inv-summary-label">Existencias totales</span>
          <strong>{totalExistencias}</strong>
          <span className="inv-summary-description">
            Unidades disponibles en inventario
          </span>
        </article>

        <article className="inv-summary-card inv-summary-warning">
          <span className="inv-summary-label">Stock bajo</span>
          <strong>{productosBajos}</strong>
          <span className="inv-summary-description">
            Productos en su mínimo o por debajo
          </span>
        </article>
      </section>

      {/* TABLA Y PANEL LATERAL */}
      <div className="inv-content">
        <section className="inv-products-panel">
          <div className="inv-panel-heading">
            <div>
              <h3>Productos</h3>
              <p>Consulta y administra tus productos registrados.</p>
            </div>
          </div>

          {error && <p className="inv-error">{error}</p>}

          {cargando ? (
            <p className="inv-message">Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p className="inv-message">Todavía no hay productos registrados.</p>
          ) : (
            <div className="inv-table-scroll">
              <div className="inv-table-header">
                <div></div>
                <div>Nombre</div>
                <div>Descripción</div>
                <div>Marca</div>
                <div>Stock</div>
                <div>Mínimo</div>
              </div>

              <div className="inv-table-body">
                {productos.map((producto) => (
                  <InventarioRow
                    key={producto.id}
                    producto={producto}
                    refresh={cargar}
                    activeRow={activeRow}
                    setActiveRow={setActiveRow}
                    onRegistrarLote={abrirFormularioLote}
                    onEditarProducto={abrirEdicionProducto}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* PANEL LATERAL */}
        <aside className="inv-side-panel">
          {productoParaLote ? (
            <>
              <div className="inv-side-heading">
                <div>
                  <h3>Registrar inventario</h3>
                  <p>Entrada de un nuevo lote de producto.</p>
                </div>

                <button
                  type="button"
                  className="inv-side-close"
                  onClick={cerrarFormularioLote}
                  title="Cerrar formulario"
                >
                  ×
                </button>
              </div>

              <div className="inv-selected-product">
                <span>PRODUCTO SELECCIONADO</span>
                <strong>{productoParaLote.nombre}</strong>
                <small>
                  Stock actual: {productoParaLote.stock ?? 0} unidades
                </small>
              </div>

              <LoteFormInline producto={productoParaLote} refresh={cargar} />
            </>
          ) : productoSeleccionado ? (
            <>
              <h3>Gestión de inventario</h3>
              <p className="inv-side-label">PRODUCTO SELECCIONADO</p>
              <strong>{productoSeleccionado.nombre}</strong>
              <p>
                Para registrar nuevas existencias, abre las acciones del
                producto y selecciona la opción de lotes.
              </p>
            </>
          ) : (
            <>
              <h3>Gestión de inventario</h3>
              <p>
                Selecciona un producto de la tabla para consultar sus opciones
                de administración.
              </p>
            </>
          )}
        </aside>
      </div>

      {/* MODAL PARA CREAR O EDITAR PRODUCTOS */}
      {showModal && (
        <GestionProductosModal
          productoEditar={productoEditar}
          onClose={cerrarModalProducto}
          onGuardado={cargar}
        />
      )}
    </div>
  );
}

export default Inventario;
