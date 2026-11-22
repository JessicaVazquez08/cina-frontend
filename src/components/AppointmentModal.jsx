
import { useEffect, useState } from "react";

import {
    crearCita,
    actualizarCita,
    marcarAtendida,
    cancelarCita
} from "../services/citasService";

import {
    buscarPacientes,
    crearPaciente,
    actualizarPaciente
} from "../services/pacienteService";

function AppointmentModal({ data, onClose, refresh }) {

    const [busqueda, setBusqueda] = useState("");
    const [resultados, setResultados] = useState([]);

    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [editando, setEditando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [formPaciente, setFormPaciente] = useState({
        nombre: "",
        telefono: "",
        email: ""
    });

    const esEdicion = !!data.cita;
    const esAtendida = data.cita?.estado === "ATENDIDA";
    const esCancelada = data.cita?.estado === "CANCELADO";

    // Inicializar paciente cuando se abre una cita existente
    useEffect(() => {
        if (data.cita?.paciente) {
            setPacienteSeleccionado(data.cita.paciente);

            setFormPaciente({
                nombre: data.cita.paciente.nombre || "",
                telefono: data.cita.paciente.telefono || "",
                email: data.cita.paciente.email || ""
            });
        }
    }, [data]);

    // Buscar pacientes
    useEffect(() => {
        const fetchPacientes = async () => {
            if (busqueda.trim().length < 2) {
                setResultados([]);
                return;
            }

            try {
                const pacientes = await buscarPacientes(busqueda);
                setResultados(pacientes);
            } catch (error) {
                console.error("Error al buscar pacientes:", error);
                setResultados([]);
            }
        };

        fetchPacientes();
    }, [busqueda]);

    // Seleccionar paciente
    const seleccionarPaciente = (paciente) => {
        setPacienteSeleccionado(paciente);

        setFormPaciente({
            nombre: paciente.nombre || "",
            telefono: paciente.telefono || "",
            email: paciente.email || ""
        });

        setEditando(false);
        setBusqueda("");
        setResultados([]);
    };

    // Formato de hora
    const formatHora = (hora) => {
        const [h, m] = hora.split(":");
        return `${h.padStart(2, "0")}:${m}:00`;
    };

    // Validar formulario
    const puedeCrearPaciente = () => {
        return (
            formPaciente.nombre.trim() &&
            formPaciente.telefono.trim() &&
            formPaciente.email.trim()
        );
    };

    // Guardar cita
    const guardar = async () => {

        if (!pacienteSeleccionado && !puedeCrearPaciente()) {
            alert("Selecciona un paciente o completa sus datos.");
            return;
        }

        try {
            setGuardando(true);

            let pacienteFinal = pacienteSeleccionado;

            // Crear paciente nuevo
            if (!pacienteFinal) {
                pacienteFinal = await crearPaciente(formPaciente);
            }

            // Actualizar paciente existente
            else if (editando) {
                pacienteFinal = await actualizarPaciente(
                    pacienteFinal.id,
                    formPaciente
                );
            }

            const payload = {
                fecha: data.dia,
                hora: formatHora(data.hora),
                estado: "OCUPADO",
                paciente: {
                    id: pacienteFinal.id
                }
            };

            if (esEdicion) {
                await actualizarCita(data.cita.id, payload);
            } else {
                await crearCita(payload);
            }

            await refresh();
            onClose();

        } catch (error) {
            console.error("Error al guardar cita:", error);
            alert(error.message || "No se pudo guardar la cita.");

        } finally {
            setGuardando(false);
        }
    };

    // Cancelar cita
    const cancelar = async () => {

        if (!data.cita) {
            onClose();
            return;
        }

        try {
            await cancelarCita(data.cita.id);

            await refresh();
            onClose();

        } catch (error) {
            console.error("Error al cancelar cita:", error);
            alert("Error al cancelar cita.");
        }
    };

    // Marcar cita como atendida
    const atender = async () => {

        try {
            await marcarAtendida(data.cita.id);

            await refresh();
            onClose();

        } catch (error) {
            console.error("Error al atender cita:", error);
            alert("Error al marcar como atendida.");
        }
    };

    const mostrarBusqueda =
        !esAtendida &&
        !esCancelada &&
        (!esEdicion || editando || !data.cita?.paciente);

    const puedeGuardar =
        !esAtendida &&
        !esCancelada &&
        (
            (!esEdicion && (pacienteSeleccionado || puedeCrearPaciente())) ||
            (esEdicion && editando && pacienteSeleccionado)
        );

    return (
        <div className="cw-modal-overlay" onClick={onClose}>

            <div
                className="cw-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="cw-close"
                    onClick={onClose}
                    type="button"
                >
                    ×
                </button>

                <h3>
                    {esAtendida
                        ? "Cita atendida"
                        : esCancelada
                            ? "Cita cancelada"
                            : esEdicion
                                ? "Editar cita"
                                : "Nueva cita"}
                </h3>

                <p>{data.dia} - {data.hora}</p>

                {/* BUSCAR PACIENTE */}
                {mostrarBusqueda && (
                    <input
                        placeholder="Buscar paciente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                )}

                {/* RESULTADOS */}
                <div className="cw-results">
                    {resultados.map(p => (
                        <div
                            key={p.id}
                            className="cw-result-item"
                            onClick={() => seleccionarPaciente(p)}
                        >
                            {p.nombre} - {p.telefono}
                        </div>
                    ))}
                </div>

                {!pacienteSeleccionado &&
                    busqueda.length >= 2 &&
                    resultados.length === 0 && (
                        <div className="cw-warning">
                            No existe el paciente. Completa los datos para crearlo.
                        </div>
                    )}

                {/* FORMULARIO DEL PACIENTE */}
                <div className="cw-form">

                    <input
                        placeholder="Nombre"
                        value={formPaciente.nombre}
                        disabled={
                            esAtendida ||
                            esCancelada ||
                            (pacienteSeleccionado && !editando)
                        }
                        onChange={(e) =>
                            setFormPaciente({
                                ...formPaciente,
                                nombre: e.target.value
                            })
                        }
                    />

                    <input
                        placeholder="Teléfono"
                        value={formPaciente.telefono}
                        disabled={
                            esAtendida ||
                            esCancelada ||
                            (pacienteSeleccionado && !editando)
                        }
                        onChange={(e) =>
                            setFormPaciente({
                                ...formPaciente,
                                telefono: e.target.value
                            })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={formPaciente.email}
                        disabled={
                            esAtendida ||
                            esCancelada ||
                            (pacienteSeleccionado && !editando)
                        }
                        onChange={(e) =>
                            setFormPaciente({
                                ...formPaciente,
                                email: e.target.value
                            })
                        }
                    />

                </div>

                {/* BOTONES */}
                <div className="cw-modal-actions">

                    {data.cita &&
                        !esAtendida &&
                        !esCancelada &&
                        pacienteSeleccionado &&
                        !editando && (
                            <>
                                <button onClick={atender}>
                                    Atender cita
                                </button>

                                <button onClick={() => setEditando(true)}>
                                    Editar paciente
                                </button>
                            </>
                        )}

                    {puedeGuardar && (
                        <button
                            onClick={guardar}
                            disabled={guardando}
                        >
                            {guardando ? "Guardando..." : "Guardar cita"}
                        </button>
                    )}

                    {data.cita && !esAtendida && !esCancelada && (
                        <button onClick={cancelar}>
                            Cancelar cita
                        </button>
                    )}

                    {!data.cita && (
                        <button onClick={onClose}>
                            Cerrar
                        </button>
                    )}

                </div>

            </div>
        </div>
    );
}

export default AppointmentModal;
