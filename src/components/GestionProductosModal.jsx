import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

function GestionProductosModal({ onClose }) {

  const [marcas, setMarcas] = useState([]);
  const [nuevaMarca, setNuevaMarca] = useState("");

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    stockMinimo: "",
    marcaId: ""
  });

  // =========================
  // CARGAR MARCAS
  // =========================
  const cargarMarcas = async () => {
    const res = await fetch(`${API}/marcas`);
    const data = await res.json();
    setMarcas(data);
  };

  useEffect(() => {
    cargarMarcas();
  }, []);

  // =========================
  // CREAR MARCA
  // =========================
  const crearMarca = async () => {

    if (!nuevaMarca) return;

    await fetch(`${API}/marcas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevaMarca })
    });

    setNuevaMarca("");
    cargarMarcas();
  };

  // =========================
  // CREAR PRODUCTO
  // =========================
  const guardarProducto = async () => {

    if (!producto.nombre || !producto.marcaId) {
      alert("Completa los campos obligatorios");
      return;
    }

    await fetch(`${API}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        stockMinimo: Number(producto.stockMinimo || 0),
        marca: { id: producto.marcaId }
      })
    });

    alert("Producto guardado");

    setProducto({
      nombre: "",
      descripcion: "",
      stockMinimo: "",
      marcaId: ""
    });
  };

  return (
    <div className="inv-modal">

      <div className="inv-modal-content">

        <button className="inv-close" onClick={onClose}>×</button>

        <h3>Gestión de productos</h3>

        {/* ================= MARCAS ================= */}
        <div className="inv-section">

          <h4>Alta de Marcas</h4>

          <div className="inv-inline">

            <input
              placeholder="Nueva marca"
              value={nuevaMarca}
              onChange={(e) => setNuevaMarca(e.target.value)}
            />

            <button onClick={crearMarca}>Agregar</button>

          </div>

          <select
            value={producto.marcaId}
            onChange={(e) =>
              setProducto({ ...producto, marcaId: e.target.value })
            }
          >
            <option value="">Selecciona marca</option>
            {marcas.map(m => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

        </div>

        {/* ================= PRODUCTO ================= */}
        <div className="inv-section">

          <h4>Alta de Producto</h4>

          <input
            placeholder="Nombre"
            value={producto.nombre}
            onChange={(e) =>
              setProducto({ ...producto, nombre: e.target.value })
            }
          />

          <input
            placeholder="Descripción"
            value={producto.descripcion}
            onChange={(e) =>
              setProducto({ ...producto, descripcion: e.target.value })
            }
          />

          <input
            placeholder="Stock mínimo"
            type="number"
            value={producto.stockMinimo}
            onChange={(e) =>
              setProducto({ ...producto, stockMinimo: e.target.value })
            }
          />

          <button className="inv-btn" onClick={guardarProducto}>
            Guardar producto
          </button>

        </div>

      </div>
    </div>
  );
}

export default GestionProductosModal;