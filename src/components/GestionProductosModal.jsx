import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "../styles/gestionProductosModal.css";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const API_ORIGIN = API_URL?.replace(/\/api$/, "");

function GestionProductosModal({ onClose, onGuardado, productoEditar = null }) {
  const [marcas, setMarcas] = useState([]);
  const [nuevaMarca, setNuevaMarca] = useState("");
  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    stockMinimo: "",
    marcaId: "",
  });

  const modoEdicion = Boolean(productoEditar);

  const imagenActual = productoEditar?.imagenUrl
    ? productoEditar.imagenUrl.startsWith("http")
      ? productoEditar.imagenUrl
      : `${API_ORIGIN}${productoEditar.imagenUrl}`
    : "";

  useEffect(() => {
    cargarMarcas();

    if (productoEditar) {
      setProducto({
        nombre: productoEditar.nombre || "",
        descripcion: productoEditar.descripcion || "",
        stockMinimo: productoEditar.stockMinimo ?? "",
        marcaId: productoEditar.marca?.id
          ? String(productoEditar.marca.id)
          : "",
      });
    } else {
      setProducto({
        nombre: "",
        descripcion: "",
        stockMinimo: "",
        marcaId: "",
      });
    }

    setImagen(null);
    setError("");
  }, [productoEditar]);

  useEffect(() => {
    if (!imagen) {
      setVistaPrevia("");
      return;
    }

    const url = URL.createObjectURL(imagen);
    setVistaPrevia(url);

    return () => URL.revokeObjectURL(url);
  }, [imagen]);

  const cargarMarcas = async () => {
    try {
      const data = await apiRequest("/marcas");
      setMarcas(data || []);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
      setError("No fue posible cargar las marcas.");
    }
  };

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setProducto((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

    if (!tiposPermitidos.includes(archivo.type)) {
      setError("Selecciona una imagen JPG, PNG o WEBP.");
      e.target.value = "";
      return;
    }

    if (archivo.size > 3 * 1024 * 1024) {
      setError("La imagen no debe superar los 3 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImagen(archivo);
  };

  const crearMarca = async () => {
    if (!nuevaMarca.trim()) {
      setError("Escribe el nombre de la marca.");
      return;
    }

    try {
      setError("");

      await apiRequest("/marcas", {
        method: "POST",
        body: JSON.stringify({
          nombre: nuevaMarca.trim(),
        }),
      });

      setNuevaMarca("");
      await cargarMarcas();
    } catch (error) {
      console.error("Error al crear marca:", error);
      setError(error.message || "No se pudo crear la marca.");
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (!producto.nombre.trim() || !producto.marcaId) {
      setError("El nombre y la marca son obligatorios.");
      return;
    }

    try {
      setCargando(true);
      setError("");

      const datosProducto = {
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion.trim(),
        stockMinimo: Number(producto.stockMinimo || 0),
        marca: {
          id: Number(producto.marcaId),
        },
      };

      const formData = new FormData();

      formData.append(
        "producto",
        new Blob([JSON.stringify(datosProducto)], {
          type: "application/json",
        }),
      );

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const endpoint = modoEdicion
        ? `/productos/${productoEditar.id}`
        : "/productos";

      await apiRequest(endpoint, {
        method: modoEdicion ? "PUT" : "POST",
        body: formData,
      });

      if (onGuardado) {
        await onGuardado();
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setError(error.message || "No se pudo guardar el producto.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="inv-modal gestion-productos-overlay">
      <div className="inv-modal-content gestion-productos-modal">
        <button
          className="inv-close"
          onClick={onClose}
          type="button"
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="gestion-productos-heading">
          <span className="gestion-productos-eyebrow">
            INVENTARIO · CATÁLOGO
          </span>

          <h3>{modoEdicion ? "Editar producto" : "Registrar producto"}</h3>

          <p>
            {modoEdicion
              ? "Modifica la información y fotografía del producto."
              : "Agrega la información y fotografía del nuevo producto."}
          </p>
        </div>

        {error && <div className="gestion-productos-error">{error}</div>}

        <form onSubmit={guardarProducto}>
          <div className="gestion-productos-layout">
            <section className="gestion-productos-photo">
              <label className="gestion-productos-label">
                Fotografía del producto
              </label>

              <label
                className={`gestion-productos-dropzone ${
                  vistaPrevia || imagenActual ? "has-image" : ""
                }`}
              >
                {vistaPrevia || imagenActual ? (
                  <img
                    src={vistaPrevia || imagenActual}
                    alt="Fotografía del producto"
                  />
                ) : (
                  <div className="gestion-productos-placeholder">
                    <span className="gestion-productos-camera">＋</span>
                    <strong>Agregar fotografía</strong>
                    <small>JPG, PNG o WEBP · Máximo 3 MB</small>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={seleccionarImagen}
                />
              </label>

              {(imagen || imagenActual) && (
                <button
                  type="button"
                  className="gestion-productos-remove-image"
                  onClick={() => setImagen(null)}
                >
                  {imagen
                    ? "Cancelar cambio de fotografía"
                    : "Conservar fotografía actual"}
                </button>
              )}
            </section>

            <section className="gestion-productos-fields">
              <div className="gestion-productos-section-title">
                <h4>Información general</h4>
                <p>Los campos marcados con * son obligatorios.</p>
              </div>

              <label className="gestion-productos-label" htmlFor="nombre">
                Nombre del producto *
              </label>

              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Ej. Crema hidratante"
                value={producto.nombre}
                onChange={actualizarCampo}
                required
              />

              <label className="gestion-productos-label" htmlFor="descripcion">
                Descripción
              </label>

              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe brevemente el producto..."
                value={producto.descripcion}
                onChange={actualizarCampo}
                rows="4"
              />

              <label className="gestion-productos-label" htmlFor="marcaId">
                Marca *
              </label>

              <select
                id="marcaId"
                name="marcaId"
                value={producto.marcaId}
                onChange={actualizarCampo}
                required
              >
                <option value="">Selecciona una marca</option>

                {marcas.map((marca) => (
                  <option key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>

              <div className="gestion-productos-new-brand">
                <label className="gestion-productos-label" htmlFor="nuevaMarca">
                  ¿La marca no está registrada?
                </label>

                <div className="gestion-productos-brand-row">
                  <input
                    id="nuevaMarca"
                    type="text"
                    placeholder="Nombre de la nueva marca"
                    value={nuevaMarca}
                    onChange={(e) => setNuevaMarca(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={crearMarca}
                    disabled={!nuevaMarca.trim() || cargando}
                  >
                    Agregar
                  </button>
                </div>
              </div>

              <label className="gestion-productos-label" htmlFor="stockMinimo">
                Stock mínimo
              </label>

              <input
                id="stockMinimo"
                name="stockMinimo"
                type="number"
                min="0"
                placeholder="0"
                value={producto.stockMinimo}
                onChange={actualizarCampo}
              />

              <small className="gestion-productos-help">
                Se utilizará para identificar cuándo las existencias son bajas.
              </small>
            </section>
          </div>

          <div className="gestion-productos-actions">
            <button
              type="button"
              className="gestion-productos-cancel"
              onClick={onClose}
              disabled={cargando}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="gestion-productos-save"
              disabled={cargando}
            >
              {cargando
                ? "Guardando..."
                : modoEdicion
                  ? "Guardar cambios"
                  : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GestionProductosModal;
