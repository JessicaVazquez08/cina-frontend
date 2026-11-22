import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const CarritoContext = createContext(null);
const STORAGE_KEY = "cina_carrito";

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      return guardado ? JSON.parse(guardado) : [];
    } catch (error) {
      console.error("No se pudo recuperar el carrito:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const stock = Number(producto.stock || 0);
    const cantidadAgregar = Number(cantidad);
    const precio = Number(producto.precioActual || 0);

    if (stock <= 0 || cantidadAgregar < 1) {
      return { ok: false, mensaje: "Este producto no tiene existencias." };
    }

    setItems((actuales) => {
      const existente = actuales.find((item) => item.id === producto.id);
      const cantidadActual = existente?.cantidad || 0;

      if (cantidadActual + cantidadAgregar > stock) {
        return actuales;
      }

      const datosProducto = {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion || "",
        precio,
        stock,
        imagenUrl: producto.imagenUrl || "",
        marca: producto.marca?.nombre || "",
      };

      if (existente) {
        return actuales.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidadAgregar }
            : item,
        );
      }

      return [...actuales, { ...datosProducto, cantidad: cantidadAgregar }];
    });

    const cantidadExistente =
      items.find((item) => item.id === producto.id)?.cantidad || 0;

    if (cantidadExistente + cantidadAgregar > stock) {
      return {
        ok: false,
        mensaje: `Solo hay ${stock} unidades disponibles.`,
      };
    }

    return { ok: true };
  };

  const cambiarCantidad = (id, cantidad) => {
    const nuevaCantidad = Number(cantidad);

    setItems((actuales) =>
      actuales.map((item) => {
        if (item.id !== id) return item;

        if (nuevaCantidad < 1) return item;

        if (nuevaCantidad > item.stock) {
          return item;
        }

        return { ...item, cantidad: nuevaCantidad };
      }),
    );
  };

  const eliminarDelCarrito = (id) => {
    setItems((actuales) => actuales.filter((item) => item.id !== id));
  };

  const vaciarCarrito = useCallback(() => {
    setItems([]);
  }, []);

  const totalArticulos = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items],
  );

  const total = useMemo(
    () => items.reduce((suma, item) => suma + item.precio * item.cantidad, 0),
    [items],
  );

  const value = {
    items,
    totalArticulos,
    total,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
}

export function useCarrito() {
  const context = useContext(CarritoContext);

  if (!context) {
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider");
  }

  return context;
}
