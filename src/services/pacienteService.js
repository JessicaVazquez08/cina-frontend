
import { apiRequest } from "./api";

const API = "/pacientes";

export const buscarPacientes = async (query) => {
    return apiRequest(`${API}/buscar?query=${encodeURIComponent(query)}`);
};

export const crearPaciente = async (paciente) => {
    return apiRequest(API, {
        method: "POST",
        body: JSON.stringify(paciente)
    });
};

export const actualizarPaciente = async (id, paciente) => {
    return apiRequest(`${API}/${id}`, {
        method: "PUT",
        body: JSON.stringify(paciente)
    });
};
