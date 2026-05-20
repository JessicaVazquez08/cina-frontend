import { useEffect, useState } from "react";
import { crearCita, actualizarCita, marcarAtendida, cancelarCita } from "../services/citasService";
import { buscarPacientes, crearPaciente, actualizarPaciente } from "../services/pacienteService";

function AppointmentModal({ data, onClose, refresh }) {

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);

  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [editando, setEditando] = useState(false);

  const [formPaciente, setFormPaciente] = useState({
    nombre: "",
    telefono: "",
    email: ""
  });

  const esEdicion = !!data.cita;
  const esAtendida = data.cita?.estado === "ATENDIDA";  

  // BUSQUEDA
  useEffect(() => {
    const fetch = async () => {
      if (busqueda.length < 2) {
        setResultados([]);
        return;
      }

      const data = await buscarPacientes(busqueda);
      setResultados(data);
    };

    fetch();
  }, [busqueda]);

  useEffect(() => {
    if (data.cita) {
      setPacienteSeleccionado(data.cita.paciente);

      setFormPaciente({
        nombre: data.cita.paciente?.nombre || "",
        telefono: data.cita.paciente?.telefono || "",
        email: data.cita.paciente?.email || ""
      });

    }
  }, [data]);

  // Selección de paciente
  const seleccionarPaciente = (p) => {
    setPacienteSeleccionado(p);
    setFormPaciente(p);
    setEditando(false);
  };

  // Formato hora
  const formatHora = (hora) => {
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m}:00`;
  };

  // Guardar cita
  const guardar = async () => {

    if (!pacienteSeleccionado && !puedeCrearPaciente()) {
      alert("Selecciona un paciente o completa los datos");
      return;
    }

    let pacienteFinal = pacienteSeleccionado;

    // SI NO EXISTE → CREAR
    if (!pacienteFinal) {
      pacienteFinal = await crearPaciente(formPaciente);
    }

    // SI EDITA → ACTUALIZAR
    if (editando && pacienteSeleccionado) {
      pacienteFinal = await actualizarPaciente(
        pacienteSeleccionado.id,
        formPaciente
      );
    }

    const payload = {
      fecha: data.dia,
      hora: formatHora(data.hora),
      estado: "OCUPADO",
      paciente: { id: pacienteSeleccionado.id }
    };

    if (esEdicion) {
      await actualizarCita(data.cita.id, payload);
    } else {
      await crearCita(payload);
    }

    refresh();
    onClose();
  };

  const cancelar = async () => {
  
      if (!data.cita) {
        onClose();
        return;
      }
  
      
      try {
        await cancelarCita(data.cita.id);     
  
        refresh();
        onClose();
  
      } catch (error) {
        console.error("Error al cancelar cita", error);
        alert("Error al cancelar cita");
      }
    };
  
  const atender = async () => {
    try {
      await marcarAtendida(data.cita.id);      
  
      refresh();
      onClose();
  
    } catch (error) {
      alert("Error al marcar como atendida");
    }
  };

  const puedeCrearPaciente = () => {
    return (
      formPaciente.nombre &&
      formPaciente.telefono &&
      formPaciente.email
    );
  };

  return (
    <div className="cw-modal-overlay" onClick={onClose}>

      <div className="cw-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cw-close" onClick={onClose}>
          ×
        </button>

        <h3>{(data.cita && data.cita.estado === "ATENDIDA") ? "Cita atendida" : esEdicion ? "Editar cita" : "Nueva cita"}</h3>
        <p>{data.dia} - {data.hora}</p>

        {/*  BUSCAR */}
        {data.cita.paciente == undefined || (data.cita && (data.cita.estado !== "ATENDIDA") && editando) && (
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
        {!pacienteSeleccionado && busqueda.length > 2 && resultados.length === 0 && (
          <div className="cw-warning">
            No existe el paciente. Completa los datos para crearlo.
          </div>
        )}

        {/* FORMULARIO */}
        <div className="cw-form">

          <input 
            placeholder="Nombre"
            value={formPaciente.nombre}
            disabled={esAtendida || (pacienteSeleccionado && !editando)}
            onChange={(e) =>
              setFormPaciente({ ...formPaciente, nombre: e.target.value })
            }
          />

          <input
            placeholder="Teléfono"
            value={formPaciente.telefono}
            disabled={esAtendida || (pacienteSeleccionado && !editando)}
            onChange={(e) =>
              setFormPaciente({ ...formPaciente, telefono: e.target.value })
            }
          />

          <input
            placeholder="Email"
            value={formPaciente.email}
            disabled={esAtendida || (pacienteSeleccionado && !editando)}
            onChange={(e) =>
              setFormPaciente({ ...formPaciente, email: e.target.value })
            }
          />

        </div>

        {/* BOTONES */}
        <div className="cw-modal-actions">
          
          {data.cita && (data.cita.estado !== "ATENDIDA" && data.cita.estado !== "CANCELADO" ) && pacienteSeleccionado && !editando && (
            <button onClick={atender}>
              Atender cita
            </button>
          )}

          {data.cita && data.cita.estado !== "ATENDIDA" && pacienteSeleccionado && !editando && (
            <button onClick={() => setEditando(true)}>
              Editar paciente
            </button>
          )}

          {pacienteSeleccionado && editando && (
            <button 
              onClick={guardar}
              disabled={esAtendida || (!pacienteSeleccionado && !puedeCrearPaciente())}
            >
              Guardar cita
            </button>
          )}

          {data.cita && (data.cita.estado !== "ATENDIDA" && data.cita.estado !== "CANCELADO" ) && (
            <button onClick={cancelar}>
              Cancelar cita
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default AppointmentModal;