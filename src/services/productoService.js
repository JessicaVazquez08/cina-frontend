const API = import.meta.env.VITE_API_URL + "/productos";

export const obtenerProductos = async () => {
  const res = await fetch(API);
  return res.json();
};

export const crearProducto = async (producto) => {
  const res = await fetch(API, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(producto)
  });
  return res.json();
};

export const actualizarProducto = async (id, producto) => {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(producto)
  });
  return res.json();
};

export const eliminarProducto = async (id) => {
  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });
};