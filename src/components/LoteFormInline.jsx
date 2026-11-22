import { useState } from "react";
import { crearLote } from "../services/inventarioService";
import { SaveIcon } from "./Icons.jsx";

function LoteFormInline({ producto, refresh }) {
  const [form, setForm] = useState({
    numeroLote: "",
    stockInicial: "",
    precioCompra: "",
    fechaEntrada: "",
    fechaCaducidad: "",
  });

  const [guardando, setGuardando] = useState(false);

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setForm((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (
      !form.numeroLote.trim() ||
      !form.stockInicial ||
      !form.precioCompra ||
      !form.fechaEntrada ||
      !form.fechaCaducidad
    ) {
      alert("Completa todos los campos para registrar el lote.");
      return;
    }

    if (Number(form.stockInicial) <= 0) {
      alert("El stock inicial debe ser mayor que cero.");
      return;
    }

    if (Number(form.precioCompra) < 0) {
      alert("El precio de compra no puede ser negativo.");
      return;
    }

    if (form.fechaCaducidad < form.fechaEntrada) {
      alert("La fecha final no puede ser anterior a la fecha inicial.");
      return;
    }

    try {
      setGuardando(true);

      await crearLote({
        numeroLote: form.numeroLote.trim(),
        stockInicial: Number(form.stockInicial),
        precioCompra: Number(form.precioCompra),
        fechaEntrada: form.fechaEntrada,
        fechaCaducidad: form.fechaCaducidad,
        producto: {
          id: producto.id,
        },
      });

      alert("Lote registrado correctamente.");

      setForm({
        numeroLote: "",
        stockInicial: "",
        precioCompra: "",
        fechaEntrada: "",
        fechaCaducidad: "",
      });

      await refresh();
    } catch (error) {
      console.error("Error al registrar lote:", error);
      alert("No fue posible registrar el lote.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="inv-lote-form" onSubmit={guardar}>
      <div className="inv-lote-field">
        <label htmlFor={`numeroLote-${producto.id}`}>Número de lote</label>
        <input
          id={`numeroLote-${producto.id}`}
          type="text"
          name="numeroLote"
          placeholder="Ej. LOT-001"
          value={form.numeroLote}
          onChange={actualizarCampo}
        />
      </div>

      <div className="inv-lote-field">
        <label htmlFor={`stockInicial-${producto.id}`}>Stock inicial</label>
        <input
          id={`stockInicial-${producto.id}`}
          type="number"
          name="stockInicial"
          min="1"
          placeholder="Cantidad"
          value={form.stockInicial}
          onChange={actualizarCampo}
        />
      </div>

      <div className="inv-lote-field">
        <label htmlFor={`precioCompra-${producto.id}`}>Precio de compra</label>
        <input
          id={`precioCompra-${producto.id}`}
          type="number"
          name="precioCompra"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.precioCompra}
          onChange={actualizarCampo}
        />
      </div>

      {/* Fechas divididas en dos partes */}
      <div className="inv-lote-date-field">
        <label htmlFor={`fechaEntrada-${producto.id}`}>Fecha de entrada</label>
        <input
          id={`fechaEntrada-${producto.id}`}
          type="date"
          name="fechaEntrada"
          value={form.fechaEntrada}
          onChange={actualizarCampo}
        />
      </div>

      <div className="inv-lote-date-field">
        <label htmlFor={`fechaCaducidad-${producto.id}`}>
          Fecha de caducidad
        </label>
        <input
          id={`fechaCaducidad-${producto.id}`}
          type="date"
          name="fechaCaducidad"
          value={form.fechaCaducidad}
          onChange={actualizarCampo}
        />
      </div>

      <button type="submit" className="inv-lote-submit" disabled={guardando}>
        <SaveIcon />
        <span>{guardando ? "Registrando..." : "Agregar lote"}</span>
      </button>
    </form>
  );
}

export default LoteFormInline;
