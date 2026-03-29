function FiltersBar({ setFechaBase }) {

  return (
    <div style={{ marginBottom: "20px" }}>

      <input
        type="date"
        onChange={(e) => setFechaBase(new Date(e.target.value))}
      />

      <input placeholder="Buscar paciente..." />

      <select>
        <option>Todos</option>
        <option>OCUPADO</option>
        <option>DISPONIBLE</option>
      </select>

    </div>
  );
}

export default FiltersBar;