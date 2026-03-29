import { useEffect, useState } from "react";
import CalendarGrid from "../components/CalendarGrid";
import AppointmentModal from "../components/AppointmentModal";
import { obtenerCitasPorFecha } from "../services/citasService";
import "../styles/calendario.css";

function Calendario() {

  const [fecha, setFecha] = useState(new Date());
  const [citas, setCitas] = useState([]);
  const [modal, setModal] = useState(null);

  const format = (d) => d.toISOString().split("T")[0];

  const dias = [...Array(5)].map((_, i) => {
    const d = new Date(fecha);
    d.setDate(d.getDate() + i);
    return format(d);
  });

  const cargar = async () => {
    const todas = [];

    for (let i = 0; i < 5; i++) {

      const d = new Date(fecha);
      d.setDate(d.getDate() + i);

      const fechaStr = d.toISOString().split("T")[0];

      const data = await obtenerCitasPorFecha(fechaStr);

      todas.push(...data);
    }

    setCitas(todas);
  };

  useEffect(() => { cargar(); }, [fecha]);

  return (
    <div>

      <h2>Calendario</h2>

      <input
        type="date"
        onChange={(e) => setFecha(new Date(e.target.value))}
      />

      <CalendarGrid
        dias={dias}
        citas={citas}
        onClickSlot={setModal}
      />

      {modal && (
        <AppointmentModal
          data={modal}
          onClose={() => setModal(null)}
          refresh={cargar}
        />
      )}

    </div>
  );
}

export default Calendario;