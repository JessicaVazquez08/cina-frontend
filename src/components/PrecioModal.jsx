import { useEffect, useState } from "react";
import {
  crearPrecio,
  obtenerPrecios
} from "../services/inventarioService";

function PrecioModal({ producto, onClose }) {

    const [precios, setPrecios] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const [nuevo, setNuevo] = useState({
        precioVenta: "",
        fechaInicio: "",
        fechaFin: ""
    });

    // =========================
    // CARGAR PRECIOS
    // =========================
    const cargar = async () => {
        const data = await obtenerPrecios(producto.id);
        setPrecios(data);

        const fechaAuto = calcularFechaInicio(data);

        setNuevo(prev => ({
            ...prev,
            fechaInicio: fechaAuto
        }));
    };

    useEffect(() => {
        cargar();
    }, []);

    // =========================
    // GUARDAR PRECIO
    // =========================
    const guardar = async () => {

        if (!nuevo.precioVenta || !nuevo.fechaFin) {
            alert("Completa todos los campos");
            return;
        }

        if (Number(nuevo.precioVenta) <= 0) {
            alert("El precio debe ser mayor a 0");
            return;
        }

        await crearPrecio({
            precioVenta: Number(nuevo.precioVenta),
            fechaInicio: nuevo.fechaInicio,
            fechaFin: nuevo.fechaFin,
            producto: { id: producto.id }
        });

        setNuevo({
            precioVenta: "",
            fechaInicio: "",
            fechaFin: ""
        });

        setShowForm(false);
        cargar();
    };

    const calcularFechaInicio = (precios) => {

        if (!precios.length) {
            return new Date().toISOString().split("T")[0];
        }

        const ultimo = precios[0]; 

        if (!ultimo.fechaFin) {
            return ultimo.fechaInicio;
        }

        const fecha = new Date(ultimo.fechaFin);
        fecha.setDate(fecha.getDate() + 1);

        return fecha.toISOString().split("T")[0];
    };    

    return (
        <div className="inv-modal">

        <div className="inv-modal-content">

            <button className="inv-close" onClick={onClose}>×</button>

            <h3>Precios - {producto.nombre}</h3>

            {/* ================= BOTÓN AGREGAR ================= */}
            <button
                className="inv-btn"
                onClick={() => {
                    setShowForm(!showForm);

                    if (!showForm) {
                        const fechaAuto = calcularFechaInicio(precios);
                        setNuevo({
                            precioVenta: "",
                            fechaInicio: fechaAuto,
                            fechaFin: ""
                        });
                    }
                }}
            >
                {showForm ? "Cancelar" : "Agregar precio"}
            </button>

            {/* ================= FORMULARIO ================= */}
            {showForm && (
                <div className="inv-precio-form-table">

                    <div className="inv-precio-form-header">
                    <span>Precio</span>
                    <span>Fecha inicio</span>
                    <span>Fecha fin</span>
                    <span></span>
                    </div>

                    <div className="inv-precio-form-row">

                    <input
                        type="number"
                        placeholder="$"
                        value={nuevo.precioVenta}
                        onChange={(e) =>
                        setNuevo({ ...nuevo, precioVenta: e.target.value })
                        }
                    />

                    <input
                        type="date"
                        value={nuevo.fechaInicio}
                        disabled
                    />

                    <input
                        type="date"
                        value={nuevo.fechaFin}
                        onChange={(e) =>
                        setNuevo({ ...nuevo, fechaFin: e.target.value })
                        }
                    />

                    <button onClick={guardar}>Guardar</button>

                    </div>

                </div>
            )}

            {/* ================= TABLA ================= */}
            <table className="inv-precio-table">

            <thead>
                <tr>
                <th>Precio</th>
                <th>Inicio</th>
                <th>Fin</th>
                </tr>
            </thead>

            <tbody>
                {precios.map(p => (
                <tr key={p.id}>
                    <td>${p.precioVenta}</td>
                    <td>{p.fechaInicio}</td>
                    <td>{p.fechaFin || "-"}</td>
                </tr>
                ))}
            </tbody>

            </table>

        </div>
        </div>
    );
}

export default PrecioModal;