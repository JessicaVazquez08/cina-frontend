function CalendarGrid({ dias, citas, onClickSlot }) {

  const horas = [];
  for (let h = 8; h <= 20; h++) {
    horas.push(`${h}:00`);
    horas.push(`${h}:30`);
  }

  const formatHora = (hora) => {
    const [h, m] = hora.split(":");
    return `${h.padStart(2, "0")}:${m}:00`;
  };

  const getCita = (dia, hora) => {
    const horaFormateada = formatHora(hora);

    return citas.find(c =>
      c.fecha === dia &&
      c.hora === horaFormateada
    );
  };

  return (
    <div className="cw-calendar-container">

      {/* HEADER */}
      <div className="cw-calendar-header">
        <div className="cw-hour-col"></div>

        {dias.map((d, i) => (
          <div key={i} className="cw-day-header">
            {d}
          </div>
        ))}
      </div>

      {/* BODY */}
      {horas.map((hora, i) => (
        <div key={i} className="cw-calendar-row">

          <div className="cw-hour-col">{hora}</div>

          {dias.map((dia, j) => {
            const cita = getCita(dia, hora);

            return (
              <div
                key={j}
                className={`cw-slot ${cita ? "cw-ocupado" : "cw-libre"}`}
                onClick={() => onClickSlot({ dia, hora, cita })}
              >
                {cita && (
                  <span className="cw-slot-text">
                    {cita.paciente?.nombre}
                  </span>
                )}
              </div>
            );
          })}

        </div>
      ))}

    </div>
  );
}

export default CalendarGrid;