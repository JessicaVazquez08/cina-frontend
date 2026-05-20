import { useEffect, useState } from "react";
import { obtenerProductos } from "../services/inventarioService.js";
import GestionProductosModal from "../components/GestionProductosModal";
import InventarioRow from "../components/InventarioRow";
import "../styles/inventario.css";

function Inventario() {

  const [productos, setProductos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const cargar = async () => {
    const data = await obtenerProductos();
    setProductos(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="inv-container">

      <div className="inv-header">
        <h2>Inventario</h2>

        <button className="inv-btn" onClick={() => setShowModal(true)}>
          Gestión de productos
        </button>

      </div>

      <table className="inv-table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Marca</th>
            <th>Stock</th>
            <th>Mínimo</th>
            <th></th> 
          </tr>
        </thead>

        <tbody>
          {productos.map(p => (
            <InventarioRow
              key={p.id}
              producto={p}
              refresh={cargar}
              activeRow={activeRow}
              setActiveRow={setActiveRow}
            />
          ))}
        </tbody>
      </table>
      {showModal && (
        <GestionProductosModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default Inventario;