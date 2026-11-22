const API_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("cina_token");

  const esFormData = options.body instanceof FormData;

  const headers = {
    ...options.headers,
  };

  // Solo establecer JSON cuando no se envíe FormData
  if (!esFormData && options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data.message || "Error al comunicarse con el servidor",
    );
  }

  return data;
};
