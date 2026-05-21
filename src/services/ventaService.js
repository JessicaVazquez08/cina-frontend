const API = import.meta.env.VITE_API_URL;

export const crearVenta = async (detalles) => {
  const res = await fetch(`${API}/ventas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(detalles)
  });
  return res.json();
};

export const obtenerProductos = async () => {
  const res = await fetch(`${API}/productos`);
  return res.json();
};

export const buscarProductos = async (query) => {
  const res = await fetch(`${API}/productos?search=${query}`);
  return res.json();
};