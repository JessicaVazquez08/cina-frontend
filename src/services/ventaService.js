
import { apiRequest } from "./api";

export const crearVenta = async (detalles) => {
    return apiRequest("/ventas", {
        method: "POST",
        body: JSON.stringify(detalles)
    });
};

export const obtenerProductos = async () => {
    return apiRequest("/productos");
};

export const buscarProductos = async (query) => {
    return apiRequest(`/productos?search=${encodeURIComponent(query)}`);
};
