
import { apiRequest } from "./api";

const API = "/citas";

export const obtenerCitasPorFecha = async (fecha) => {
    return apiRequest(`${API}/fecha?fecha=${encodeURIComponent(fecha)}`);
};

export const crearCita = async (cita) => {
    return apiRequest(API, {
        method: "POST",
        body: JSON.stringify(cita)
    });
};

export const actualizarCita = async (id, cita) => {
    return apiRequest(`${API}/${id}`, {
        method: "PUT",
        body: JSON.stringify(cita)
    });
};

export const eliminarCita = async (id) => {
    return apiRequest(`${API}/${id}`, {
        method: "DELETE"
    });
};

export const cancelarCita = async (id) => {
    return apiRequest(`${API}/${id}/cancelar`, {
        method: "PUT"
    });
};

export const marcarAtendida = async (id) => {
    return apiRequest(`${API}/${id}/atender`, {
        method: "PUT"
    });
};
