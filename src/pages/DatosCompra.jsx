import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";

import { useCarrito } from "../context/CarritoContext";

import {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  marcarDireccionPredeterminada,
} from "../services/direccionService";

import {
  obtenerMetodosPago,
  crearMetodoPago,
  actualizarMetodoPago,
  eliminarMetodoPago,
  marcarMetodoPredeterminado,
} from "../services/metodoPagoService";

import "../styles/datosCompra.css";

const direccionInicial = {
  nombreDestinatario: "",
  telefono: "",
  calle: "",
  numeroExterior: "",
  numeroInterior: "",
  colonia: "",
  codigoPostal: "",
  ciudad: "",
  estado: "",
  referencias: "",
  predeterminada: false,
};

const tarjetaInicial = {
  titular: "",
  tipoTarjeta: "DEBITO",
  ultimosCuatro: "",
  mesVencimiento: "",
  anioVencimiento: "",
  predeterminado: false,
};

function DatosCompra() {
  const navigate = useNavigate();

  const { items, total, totalArticulos } = useCarrito();

  const [direcciones, setDirecciones] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);

  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("");

  const [direccionForm, setDireccionForm] = useState(direccionInicial);
  const [tarjetaForm, setTarjetaForm] = useState(tarjetaInicial);

  const [direccionEditar, setDireccionEditar] = useState(null);
  const [tarjetaEditar, setTarjetaEditar] = useState(null);

  const [mostrarDireccionForm, setMostrarDireccionForm] = useState(false);
  const [mostrarTarjetaForm, setMostrarTarjetaForm] = useState(false);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    setError("");

    try {
      const [listaDirecciones, listaMetodos] = await Promise.all([
        obtenerDirecciones(),
        obtenerMetodosPago(),
      ]);

      setDirecciones(listaDirecciones || []);
      setMetodosPago(listaMetodos || []);

      const direccionDefault = listaDirecciones?.find(
        (direccion) => direccion.predeterminada,
      );

      const tarjetaDefault = listaMetodos?.find(
        (metodo) => metodo.predeterminado,
      );

      setDireccionSeleccionada(
        String(direccionDefault?.id || listaDirecciones?.[0]?.id || ""),
      );

      setMetodoSeleccionado(
        String(tarjetaDefault?.id || listaMetodos?.[0]?.id || ""),
      );
    } catch (err) {
      console.error(err);
      setError("No fue posible cargar tus datos de compra.");
    } finally {
      setCargando(false);
    }
  };

  // DIRECCIONES

  const cambiarDireccion = (e) => {
    const { name, value, type, checked } = e.target;

    setDireccionForm((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const guardarDireccion = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      let resultado;

      if (direccionEditar) {
        resultado = await actualizarDireccion(direccionEditar, direccionForm);
      } else {
        resultado = await crearDireccion(direccionForm);
      }

      if (direccionForm.predeterminada) {
        await marcarDireccionPredeterminada(resultado.id);
      }

      await cargarDatos();

      setDireccionSeleccionada(String(resultado.id));
      setDireccionForm(direccionInicial);
      setDireccionEditar(null);
      setMostrarDireccionForm(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar la dirección.");
    } finally {
      setGuardando(false);
    }
  };

  const editarDireccion = (direccion) => {
    setDireccionEditar(direccion.id);
    setDireccionForm({
      ...direccion,
      predeterminada: Boolean(direccion.predeterminada),
    });
    setMostrarDireccionForm(true);
  };

  const borrarDireccion = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta dirección?")) return;

    try {
      await eliminarDireccion(id);
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la dirección.");
    }
  };

  const seleccionarDireccionDefault = async (id) => {
    try {
      await marcarDireccionPredeterminada(id);
      setDireccionSeleccionada(String(id));
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la dirección predeterminada.");
    }
  };

  // MÉTODOS DE PAGO

  const cambiarTarjeta = (e) => {
    const { name, value, type, checked } = e.target;

    setTarjetaForm((actual) => ({
      ...actual,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const guardarTarjeta = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      const datos = {
        ...tarjetaForm,
        mesVencimiento: Number(tarjetaForm.mesVencimiento),
        anioVencimiento: Number(tarjetaForm.anioVencimiento),
      };

      let resultado;

      if (tarjetaEditar) {
        resultado = await actualizarMetodoPago(tarjetaEditar, datos);
      } else {
        resultado = await crearMetodoPago(datos);
      }

      if (datos.predeterminado) {
        await marcarMetodoPredeterminado(resultado.id);
      }

      await cargarDatos();

      setMetodoSeleccionado(String(resultado.id));
      setTarjetaForm(tarjetaInicial);
      setTarjetaEditar(null);
      setMostrarTarjetaForm(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el método de pago.");
    } finally {
      setGuardando(false);
    }
  };

  const editarTarjeta = (metodo) => {
    setTarjetaEditar(metodo.id);
    setTarjetaForm({
      ...metodo,
      mesVencimiento: String(metodo.mesVencimiento),
      anioVencimiento: String(metodo.anioVencimiento),
      predeterminado: Boolean(metodo.predeterminado),
    });
    setMostrarTarjetaForm(true);
  };

  const borrarTarjeta = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta tarjeta?")) return;

    try {
      await eliminarMetodoPago(id);
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el método de pago.");
    }
  };

  const seleccionarTarjetaDefault = async (id) => {
    try {
      await marcarMetodoPredeterminado(id);
      setMetodoSeleccionado(String(id));
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la tarjeta predeterminada.");
    }
  };

  const continuarCompra = () => {
    if (!items.length) {
      setError("Tu carrito está vacío.");
      return;
    }

    if (!direccionSeleccionada) {
      setError("Selecciona una dirección de envío.");
      return;
    }

    if (!metodoSeleccionado) {
      setError("Selecciona un método de pago.");
      return;
    }

    navigate("/confirmacion-compra", {
      state: {
        direccionId: Number(direccionSeleccionada),
        metodoPagoId: Number(metodoSeleccionado),
        items: items.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total,
      },
    });
  };

  if (cargando) {
    return (
      <div className="datos-compra-page">
        <p className="datos-loading">Cargando tus datos de compra...</p>
      </div>
    );
  }

  return (
    <div className="datos-compra-page">
      <header className="datos-header">
        <button className="datos-back" onClick={() => navigate("/carrito")}>
          <ArrowLeft size={18} />
          Regresar al carrito
        </button>

        <h1>Datos de compra</h1>
        <p>
          Confirma dónde recibirás tu pedido y selecciona tu método de pago.
        </p>
      </header>

      {error && <div className="datos-error">{error}</div>}

      <div className="datos-layout">
        <main className="datos-principal">
          {/* DIRECCIONES */}

          <section className="datos-section">
            <div className="datos-section-header">
              <div className="datos-section-title">
                <MapPin size={22} />
                <div>
                  <h2>Dirección de envío</h2>
                  <p>¿Dónde deseas recibir tu pedido?</p>
                </div>
              </div>

              <button
                className="datos-add-button"
                onClick={() => {
                  setDireccionEditar(null);
                  setDireccionForm(direccionInicial);
                  setMostrarDireccionForm(!mostrarDireccionForm);
                }}
              >
                <Plus size={17} />
                Agregar dirección
              </button>
            </div>

            {direcciones.length === 0 && !mostrarDireccionForm && (
              <div className="datos-empty">
                No tienes direcciones registradas.
              </div>
            )}

            <div className="datos-cards">
              {direcciones.map((direccion) => (
                <article
                  key={direccion.id}
                  className={
                    String(direccionSeleccionada) === String(direccion.id)
                      ? "datos-card selected"
                      : "datos-card"
                  }
                  onClick={() => setDireccionSeleccionada(String(direccion.id))}
                >
                  <div className="datos-card-select">
                    <input
                      type="radio"
                      name="direccionSeleccionada"
                      checked={
                        String(direccionSeleccionada) === String(direccion.id)
                      }
                      onChange={() =>
                        setDireccionSeleccionada(String(direccion.id))
                      }
                    />

                    <strong>{direccion.nombreDestinatario}</strong>

                    {direccion.predeterminada && (
                      <span className="datos-default">Predeterminada</span>
                    )}
                  </div>

                  <p>
                    {direccion.calle} #{direccion.numeroExterior}
                  </p>
                  {direccion.numeroInterior && (
                    <p>Interior {direccion.numeroInterior}</p>
                  )}
                  <p>
                    {direccion.colonia}, C.P. {direccion.codigoPostal}
                  </p>
                  <p>
                    {direccion.ciudad}, {direccion.estado}
                  </p>
                  <p>Tel. {direccion.telefono}</p>

                  <div className="datos-card-actions">
                    {!direccion.predeterminada && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          seleccionarDireccionDefault(direccion.id);
                        }}
                      >
                        Hacer predeterminada
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editarDireccion(direccion);
                      }}
                    >
                      <Pencil size={14} /> Editar
                    </button>

                    <button
                      className="datos-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        borrarDireccion(direccion.id);
                      }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {mostrarDireccionForm && (
              <form className="datos-form" onSubmit={guardarDireccion}>
                <h3>
                  {direccionEditar ? "Editar dirección" : "Nueva dirección"}
                </h3>

                <div className="datos-form-grid">
                  <label>
                    Nombre de quien recibe *
                    <input
                      name="nombreDestinatario"
                      value={direccionForm.nombreDestinatario}
                      onChange={cambiarDireccion}
                      required
                    />
                  </label>

                  <label>
                    Teléfono *
                    <input
                      name="telefono"
                      value={direccionForm.telefono}
                      onChange={cambiarDireccion}
                      required
                      maxLength={20}
                    />
                  </label>

                  <label>
                    Calle *
                    <input
                      name="calle"
                      value={direccionForm.calle}
                      onChange={cambiarDireccion}
                      required
                    />
                  </label>

                  <label>
                    Número exterior *
                    <input
                      name="numeroExterior"
                      value={direccionForm.numeroExterior}
                      onChange={cambiarDireccion}
                      required
                    />
                  </label>

                  <label>
                    Número interior
                    <input
                      name="numeroInterior"
                      value={direccionForm.numeroInterior}
                      onChange={cambiarDireccion}
                    />
                  </label>

                  <label>
                    Colonia *
                    <input
                      name="colonia"
                      value={direccionForm.colonia}
                      onChange={cambiarDireccion}
                      required
                    />
                  </label>

                  <label>
                    Código postal *
                    <input
                      name="codigoPostal"
                      value={direccionForm.codigoPostal}
                      onChange={cambiarDireccion}
                      required
                      maxLength={10}
                    />
                  </label>

                  <label>
                    Ciudad o municipio *
                    <input
                      name="ciudad"
                      value={direccionForm.ciudad}
                      onChange={cambiarDireccion}
                      required
                    />
                  </label>

                  <label>
                    Estado *
                    <input
                      name="estado"
                      value={direccionForm.estado}
                      onChange={cambiarDireccion}
                      required
                    />
                  </label>

                  <label className="datos-full">
                    Referencias
                    <textarea
                      name="referencias"
                      value={direccionForm.referencias}
                      onChange={cambiarDireccion}
                      rows="2"
                    />
                  </label>
                </div>

                <label className="datos-checkbox">
                  <input
                    type="checkbox"
                    name="predeterminada"
                    checked={direccionForm.predeterminada}
                    onChange={cambiarDireccion}
                  />
                  Establecer como dirección predeterminada
                </label>

                <div className="datos-form-actions">
                  <button
                    type="button"
                    className="datos-cancel"
                    onClick={() => {
                      setMostrarDireccionForm(false);
                      setDireccionEditar(null);
                      setDireccionForm(direccionInicial);
                    }}
                  >
                    Cancelar
                  </button>

                  <button type="submit" disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar dirección"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* MÉTODOS DE PAGO */}

          <section className="datos-section">
            <div className="datos-section-header">
              <div className="datos-section-title">
                <CreditCard size={22} />
                <div>
                  <h2>Método de pago</h2>
                  <p>Selecciona una tarjeta simulada.</p>
                </div>
              </div>

              <button
                className="datos-add-button"
                onClick={() => {
                  setTarjetaEditar(null);
                  setTarjetaForm(tarjetaInicial);
                  setMostrarTarjetaForm(!mostrarTarjetaForm);
                }}
              >
                <Plus size={17} />
                Agregar tarjeta
              </button>
            </div>

            {metodosPago.length === 0 && !mostrarTarjetaForm && (
              <div className="datos-empty">
                No tienes métodos de pago registrados.
              </div>
            )}

            <div className="datos-cards">
              {metodosPago.map((metodo) => (
                <article
                  key={metodo.id}
                  className={
                    String(metodoSeleccionado) === String(metodo.id)
                      ? "datos-card selected"
                      : "datos-card"
                  }
                  onClick={() => setMetodoSeleccionado(String(metodo.id))}
                >
                  <div className="datos-card-select">
                    <input
                      type="radio"
                      name="metodoSeleccionado"
                      checked={String(metodoSeleccionado) === String(metodo.id)}
                      onChange={() => setMetodoSeleccionado(String(metodo.id))}
                    />

                    <strong>{metodo.titular}</strong>

                    {metodo.predeterminado && (
                      <span className="datos-default">Predeterminada</span>
                    )}
                  </div>

                  <p>
                    {metodo.tipoTarjeta === "CREDITO" ? "Crédito" : "Débito"}{" "}
                    •••• {metodo.ultimosCuatro}
                  </p>
                  <p>
                    Vencimiento:{" "}
                    {String(metodo.mesVencimiento).padStart(2, "0")}/
                    {metodo.anioVencimiento}
                  </p>

                  <div className="datos-card-actions">
                    {!metodo.predeterminado && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          seleccionarTarjetaDefault(metodo.id);
                        }}
                      >
                        Hacer predeterminada
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        editarTarjeta(metodo);
                      }}
                    >
                      <Pencil size={14} /> Editar
                    </button>

                    <button
                      className="datos-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        borrarTarjeta(metodo.id);
                      }}
                    >
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {mostrarTarjetaForm && (
              <form className="datos-form" onSubmit={guardarTarjeta}>
                <h3>
                  {tarjetaEditar ? "Editar tarjeta" : "Nueva tarjeta simulada"}
                </h3>

                <div className="datos-form-grid">
                  <label className="datos-full">
                    Nombre del titular *
                    <input
                      name="titular"
                      value={tarjetaForm.titular}
                      onChange={cambiarTarjeta}
                      required
                    />
                  </label>

                  <label>
                    Tipo de tarjeta *
                    <select
                      name="tipoTarjeta"
                      value={tarjetaForm.tipoTarjeta}
                      onChange={cambiarTarjeta}
                    >
                      <option value="DEBITO">Débito</option>
                      <option value="CREDITO">Crédito</option>
                    </select>
                  </label>

                  <label>
                    Últimos cuatro dígitos *
                    <input
                      name="ultimosCuatro"
                      value={tarjetaForm.ultimosCuatro}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        setTarjetaForm((actual) => ({
                          ...actual,
                          ultimosCuatro: value,
                        }));
                      }}
                      inputMode="numeric"
                      maxLength={4}
                      pattern="[0-9]{4}"
                      placeholder="1234"
                      required
                    />
                  </label>

                  <label>
                    Mes de vencimiento *
                    <select
                      name="mesVencimiento"
                      value={tarjetaForm.mesVencimiento}
                      onChange={cambiarTarjeta}
                      required
                    >
                      <option value="">Mes</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {String(i + 1).padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Año de vencimiento *
                    <input
                      type="number"
                      name="anioVencimiento"
                      value={tarjetaForm.anioVencimiento}
                      onChange={cambiarTarjeta}
                      min={new Date().getFullYear()}
                      max={new Date().getFullYear() + 15}
                      placeholder="2028"
                      required
                    />
                  </label>
                </div>

                <label className="datos-checkbox">
                  <input
                    type="checkbox"
                    name="predeterminado"
                    checked={tarjetaForm.predeterminado}
                    onChange={cambiarTarjeta}
                  />
                  Establecer como tarjeta predeterminada
                </label>

                <p className="datos-security-note">
                  Este es un método de pago simulado. No ingreses datos de una
                  tarjeta real.
                </p>

                <div className="datos-form-actions">
                  <button
                    type="button"
                    className="datos-cancel"
                    onClick={() => {
                      setMostrarTarjetaForm(false);
                      setTarjetaEditar(null);
                      setTarjetaForm(tarjetaInicial);
                    }}
                  >
                    Cancelar
                  </button>

                  <button type="submit" disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar tarjeta"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </main>

        {/* RESUMEN */}

        <aside className="datos-resumen">
          <h2>Resumen de compra</h2>

          <div className="datos-resumen-productos">
            <ShoppingBag size={19} />
            <span>{totalArticulos} artículos</span>
          </div>

          {items.map((item) => (
            <div className="datos-resumen-item" key={item.id}>
              <span>
                {item.nombre} × {item.cantidad}
              </span>
              <strong>${(item.precio * item.cantidad).toFixed(2)}</strong>
            </div>
          ))}

          <div className="datos-resumen-line">
            <span>Subtotal</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <div className="datos-resumen-line">
            <span>Envío</span>
            <strong>Gratis</strong>
          </div>

          <div className="datos-resumen-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            className="datos-confirmar"
            onClick={continuarCompra}
            disabled={!items.length}
          >
            Continuar
          </button>

          <button
            className="datos-seguir"
            onClick={() => navigate("/catalogo")}
          >
            Seguir comprando
          </button>

          <div className="datos-simulacion">
            <CheckCircle2 size={18} />
            <p>Compra de demostración. No se realizará ningún cobro real.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default DatosCompra;
