import { apiRequest } from "./api";

export const obtenerMetodosPago = async () => {
  return apiRequest("/metodos-pago");
};

export const crearMetodoPago = async (metodo) => {
  return apiRequest("/metodos-pago", {
    method: "POST",
    body: JSON.stringify(metodo),
  });
};

export const actualizarMetodoPago = async (id, metodo) => {
  return apiRequest(`/metodos-pago/${id}`, {
    method: "PUT",
    body: JSON.stringify(metodo),
  });
};

export const eliminarMetodoPago = async (id) => {
  return apiRequest(`/metodos-pago/${id}`, {
    method: "DELETE",
  });
};

export const marcarMetodoPredeterminado = async (id) => {
  return apiRequest(`/metodos-pago/${id}/predeterminado`, {
    method: "PATCH",
  });
};
