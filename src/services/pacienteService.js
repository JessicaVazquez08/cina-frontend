const API = "/api/pacientes";

export const buscarPacientes = async (query) => {
  const res = await fetch(`${API}/buscar?query=${query}`);
  return res.json();
};

export const crearPaciente = async (paciente) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(paciente)
  });
  return res.json();
};

export const actualizarPaciente = async (id, paciente) => {
  const res = await fetch(`/api/pacientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paciente)
  });
  return res.json();
};