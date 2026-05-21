const API = import.meta.env.VITE_API_URL;

export const obtenerProductos = async () => {
  const res = await fetch(`${API}/productos`);
  return res.json();
};

export const actualizarProducto = async (id, data) => {
  const res = await fetch(`${API}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const crearLote = async (lote) => {
  const res = await fetch(`${API}/inventario/lotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lote)
  });
  return res.json();
};

export const obtenerLotes = async (productoId) => {
  const res = await fetch(`${API}/inventario/lotes/${productoId}`);
  return res.json();
};

export const crearPrecio = async (data) => {
  const res = await fetch(`${API}/inventario/precios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const obtenerPrecios = async (productoId) => {
  const res = await fetch(`${API}/inventario/precios/${productoId}`);
  return res.json();
};