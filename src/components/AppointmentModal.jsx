import { useEffect, useState } from "react";
import { crearCita, actualizarCita } from "../services/citasService";
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
    
    /*await crearCita({
      fecha: data.dia,
      hora: formatHora(data.hora),
      estado: "OCUPADO",
      paciente: { id: pacienteFinal.id }
    });*/

    refresh();
    onClose();
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

        <h3>{esEdicion ? "Editar cita" : "Nueva cita"}</h3>
        <p>{data.dia} - {data.hora}</p>

        {/*  BUSCAR */}
        <input
          placeholder="Buscar paciente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

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
            disabled={pacienteSeleccionado && !editando}
            onChange={(e) =>
              setFormPaciente({ ...formPaciente, nombre: e.target.value })
            }
          />

          <input
            placeholder="Teléfono"
            value={formPaciente.telefono}
            disabled={pacienteSeleccionado && !editando}
            onChange={(e) =>
              setFormPaciente({ ...formPaciente, telefono: e.target.value })
            }
          />

          <input
            placeholder="Email"
            value={formPaciente.email}
            disabled={pacienteSeleccionado && !editando}
            onChange={(e) =>
              setFormPaciente({ ...formPaciente, email: e.target.value })
            }
          />

        </div>

        {/* BOTONES */}
        <div className="cw-modal-actions">

          {pacienteSeleccionado && !editando && (
            <button onClick={() => setEditando(true)}>
              Editar paciente
            </button>
          )}

          <button 
            onClick={guardar}
            disabled={!pacienteSeleccionado && !puedeCrearPaciente()}
          >
            Guardar cita
          </button>

          <button onClick={onClose}>
            Cancelar
          </button>

        </div>

      </div>
    </div>
  );
}

export default AppointmentModal;