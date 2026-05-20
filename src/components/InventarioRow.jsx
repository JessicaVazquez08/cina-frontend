import { useState } from "react";
import {
  actualizarProducto,
  obtenerLotes
} from "../services/inventarioService";
import LoteFormInline from "./LoteFormInline.jsx";
import PrecioModal from "./PrecioModal.jsx";
import {ArrowIcon, EditIcon, SaveIcon, BoxIcon, MoneyIcon, UpRow, DownRow} from "./Icons.jsx";

function InventarioRow({ producto, refresh, activeRow, setActiveRow}) {

    const [edit, setEdit] = useState(false);
    const [showLote, setShowLote] = useState(false);
    const [showPrecios, setShowPrecios] = useState(false);
    const [expand, setExpand] = useState(false);
    const [lotes, setLotes] = useState([]); 
    const [form, setForm] = useState({ ...producto });
    const isOpen = activeRow === producto.id;

    const guardar = async () => {
        await actualizarProducto(producto.id, form);
        setEdit(false);
        refresh();
    };

    const cargarLotes = async () => {
        const data = await obtenerLotes(producto.id);
        setLotes(data);
    };

    const toggleRow = () => {
        setActiveRow(isOpen ? null : producto.id);
    };
    
    return (
        <>
        <tr className={`inv-row ${isOpen ? "inv-open" : ""}`}>
            <td>
                <button onClick={toggleRow}>
                    <ArrowIcon open={isOpen} />
                </button>
            </td>
            <td>
                <input
                    value={form.nombre}
                    disabled={!edit}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
            </td>        

            <td>
                <input
                    value={form.descripcion || ""}
                    disabled={!edit}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                />
            </td>

            <td>{producto.marca?.nombre}</td>

            <td>{producto.stock}</td>

            <td>
            <input
                value={form.stockMinimo || ""}
                disabled={!edit}
                onChange={(e) => setForm({ ...form, stockMinimo: e.target.value })}
            />
            </td>
            <td className={`inv-actions ${isOpen ? "show" : ""}`}>

                {!edit ? (
                    <button onClick={() => setEdit(true)}><EditIcon/></button>
                ) : (
                    <button onClick={guardar}><SaveIcon/></button>
                )}

                <button onClick={() => setShowLote(!showLote)}><BoxIcon/></button>

                <button onClick={() => setShowPrecios(true)}><MoneyIcon/></button>

                <button onClick={async () => {
                    setExpand(!expand);
                    if (!expand) await cargarLotes();
                }}>
                    {expand ? <UpRow/> : <DownRow/>}
                </button>

                </td>
        </tr>

        {/* FORM LOTE */}
        {isOpen && showLote && (
            <tr>
            <td colSpan="5">
                <LoteFormInline producto={producto} refresh={refresh} />
            </td>
            </tr>
        )}

        {/* LOTES */}
        {isOpen && expand && lotes.length > 0 && (
        <tr>
            <td colSpan="7">

            <table className="inv-lote-table">

                <thead>
                <tr>
                    <th>Lote</th>
                    <th>Stock</th>
                    <th>Entrada</th>
                    <th>Caducidad</th>
                    <th>Precio compra</th>
                </tr>
                </thead>

                <tbody>
                {lotes.map(l => (
                    <tr key={l.id}>
                    <td>{l.numeroLote}</td>
                    <td>{l.stockActual}</td>
                    <td>{l.fechaEntrada}</td>
                    <td>{l.fechaCaducidad}</td>
                    <td>${l.precioCompra}</td>
                    </tr>
                ))}
                </tbody>

            </table>

            </td>
        </tr>
        )}

        {/* MODAL PRECIOS */}
        {showPrecios && (
            <PrecioModal
            producto={producto}
            onClose={() => setShowPrecios(false)}
            />
        )}

        </>
    );
}

export default InventarioRow;