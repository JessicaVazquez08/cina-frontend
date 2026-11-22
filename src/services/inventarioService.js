
import { apiRequest } from "./api";

export const obtenerProductos = async () => {
    return apiRequest("/productos");
};

export const actualizarProducto = async (id, data) => {
    return apiRequest(`/productos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    });
};

export const crearLote = async (lote) => {
    return apiRequest("/inventario/lotes", {
        method: "POST",
        body: JSON.stringify(lote)
    });
};

export const obtenerLotes = async (productoId) => {
    return apiRequest(`/inventario/lotes/${productoId}`);
};

export const crearPrecio = async (data) => {
    return apiRequest("/inventario/precios", {
        method: "POST",
        body: JSON.stringify(data)
    });
};

export const obtenerPrecios = async (productoId) => {
    return apiRequest(`/inventario/precios/${productoId}`);
};
