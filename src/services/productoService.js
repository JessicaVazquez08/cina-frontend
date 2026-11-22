
import { apiRequest } from "./api";

const API = "/productos";

export const obtenerProductos = async () => {
    return apiRequest(API);
};

export const crearProducto = async (producto) => {
    return apiRequest(API, {
        method: "POST",
        body: JSON.stringify(producto)
    });
};

export const actualizarProducto = async (id, producto) => {
    return apiRequest(`${API}/${id}`, {
        method: "PUT",
        body: JSON.stringify(producto)
    });
};

export const eliminarProducto = async (id) => {
    return apiRequest(`${API}/${id}`, {
        method: "DELETE"
    });
};
