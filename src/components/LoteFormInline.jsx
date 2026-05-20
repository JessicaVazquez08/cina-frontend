import { useState } from "react";
import { crearLote } from "../services/inventarioService";
import {SaveIcon} from "./Icons.jsx";

function LoteFormInline({ producto, refresh }) {

  const [form, setForm] = useState({
    numeroLote: "",
    stockInicial: "",
    precioCompra: ""
  });

  const guardar = async () => {

    await crearLote({
      ...form,
      fechaCaducidad: form.fechaCaducidad,
      fechaEntrada: form.fechaEntrada,
      producto: { id: producto.id }
    });

    refresh();
  };

  return (
    <div className="inv-lote-form">

      <input placeholder="Lote"
        onChange={(e) => setForm({ ...form, numeroLote: e.target.value })}
      />

      <input  placeholder="Stock"
        type="number"
        onChange={(e) => setForm({ ...form, stockInicial: e.target.value })}
      />

      <input placeholder="Precio compra"
        onChange={(e) => setForm({ ...form, precioCompra: e.target.value })}
      />

      <input placeholder="F. Caducidad" type="date" 
        onChange={(e) =>
          setForm({ ...form, fechaCaducidad: e.target.value })
        }
      />

      <input placeholder="F. Entrada" type="date"
        onChange={(e) =>
          setForm({ ...form, fechaEntrada: e.target.value })
        }
      />

      <button onClick={guardar}><SaveIcon/></button>

    </div>
  );
}

export default LoteFormInline;