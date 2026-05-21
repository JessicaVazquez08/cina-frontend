//const API_URL = import.meta.env.CINA_API_URL;

const API = import.meta.env.VITE_API_URL + "/citas";

export const obtenerCitasPorFecha = async (fecha) => {
  const res = await fetch(`${API}/fecha?fecha=${fecha}`);
  return res.json();
};

export const crearCita = async (cita) => {
  const res = await fetch(`${API}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(cita)
  });
  return res.json();
};

export const actualizarCita = async (id, cita) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(cita)
  });
  return res.json();
};

export const eliminarCita = async (id,) => {
  await fetch(`${API}/${id}`, { method: "DELETE" });
};

export const cancelarCita = async (id) => {    
      await fetch(`${API}/${id}/cancelar`, {
        method: "PUT"
      });      
  };

export const marcarAtendida = async (id) => {  
    await fetch(`${API}/${id}/atender`, {
      method: "PUT"
    });
};