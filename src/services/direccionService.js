import { apiRequest } from "./api";

export const obtenerDirecciones = async () => {
  return apiRequest("/direcciones");
};

export const crearDireccion = async (direccion) => {
  return apiRequest("/direcciones", {
    method: "POST",
    body: JSON.stringify(direccion),
  });
};

export const actualizarDireccion = async (id, direccion) => {
  return apiRequest(`/direcciones/${id}`, {
    method: "PUT",
    body: JSON.stringify(direccion),
  });
};

export const eliminarDireccion = async (id) => {
  return apiRequest(`/direcciones/${id}`, {
    method: "DELETE",
  });
};

export const marcarDireccionPredeterminada = async (id) => {
  return apiRequest(`/direcciones/${id}/predeterminada`, {
    method: "PATCH",
  });
};
