export const obtenerImagenProducto = (imagenUrl) => {
  if (!imagenUrl) return "";

  // Conservar URL externas
  if (imagenUrl.startsWith("http://") || imagenUrl.startsWith("https://")) {
    return imagenUrl;
  }

  // Las imagenes locales se sirven desde el frontend
  return imagenUrl.startsWith("/") ? imagenUrl : `/${imagenUrl}`;
};
