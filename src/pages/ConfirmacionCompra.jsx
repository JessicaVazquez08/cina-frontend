import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Download, ShoppingBag, Home } from "lucide-react";
import jsPDF from "jspdf";

import { apiRequest } from "../services/api";
import { useCarrito } from "../context/CarritoContext";

import "../styles/confirmacionCompra.css";

function ConfirmacionCompra() {
  const location = useLocation();
  const navigate = useNavigate();
  const { vaciarCarrito } = useCarrito();

  const datosCompra = location.state;
  const procesandoRef = useRef(false);
  const ticketDescargadoRef = useRef(false);

  const [cargando, setCargando] = useState(true);
  const [venta, setVenta] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (procesandoRef.current) return;

    if (
      !datosCompra?.direccionId ||
      !datosCompra?.metodoPagoId ||
      !datosCompra?.items?.length
    ) {
      setError("No encontramos los datos necesarios para confirmar tu compra.");
      setCargando(false);
      return;
    }

    procesandoRef.current = true;

    const registrarCompra = async () => {
      try {
        const respuesta = await apiRequest("/ventas/compra", {
          method: "POST",
          body: JSON.stringify({
            direccionId: datosCompra.direccionId,
            metodoPagoId: datosCompra.metodoPagoId,
            detalles: datosCompra.items.map((item) => ({
              productoId: item.id,
              cantidad: item.cantidad,
            })),
          }),
        });

        if (!respuesta?.id) {
          throw new Error("El servidor no devolvió el folio de la venta.");
        }

        setVenta(respuesta);
        vaciarCarrito();
      } catch (err) {
        console.error("Error al registrar compra:", err);
        setError(err.message || "No fue posible registrar tu compra.");
        procesandoRef.current = false;
      } finally {
        setCargando(false);
      }
    };

    registrarCompra();
  }, [datosCompra, vaciarCarrito]);

  const descargarTicket = () => {
    if (!venta) return;

    const pdf = new jsPDF();

    const fecha = venta.fecha
      ? new Date(venta.fecha).toLocaleString("es-MX")
      : new Date().toLocaleString("es-MX");

    const productos = datosCompra.items;
    const total = Number(venta.total ?? datosCompra.total ?? 0);

    let y = 20;

    pdf.setFontSize(20);
    pdf.text("CINA", 105, y, { align: "center" });

    y += 10;
    pdf.setFontSize(12);
    pdf.text("Comprobante de compra", 105, y, { align: "center" });

    y += 12;
    pdf.setFontSize(10);
    pdf.text(`Folio: ${venta.id}`, 15, y);

    y += 7;
    pdf.text(`Fecha: ${fecha}`, 15, y);

    y += 12;
    pdf.setFont("helvetica", "bold");
    pdf.text("Producto", 15, y);
    pdf.text("Cant.", 125, y);
    pdf.text("Subtotal", 195, y, { align: "right" });

    y += 7;
    pdf.setFont("helvetica", "normal");

    productos.forEach((item) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }

      const subtotal = Number(item.precio) * Number(item.cantidad);

      const nombre = pdf.splitTextToSize(item.nombre, 100);

      pdf.text(nombre, 15, y);
      pdf.text(String(item.cantidad), 125, y);
      pdf.text(`$${subtotal.toFixed(2)}`, 195, y, {
        align: "right",
      });

      y += Math.max(7, nombre.length * 5);
    });

    y += 8;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(`TOTAL: $${total.toFixed(2)}`, 195, y, {
      align: "right",
    });

    y += 15;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Método de pago: Simulación", 15, y);

    y += 7;
    pdf.text("No se realizó ningún cobro real.", 15, y);

    y += 12;
    pdf.text("Gracias por tu compra.", 105, y, {
      align: "center",
    });

    pdf.save(`Ticket_CINA_${venta.id}.pdf`);
  };

  useEffect(() => {
    if (venta && !ticketDescargadoRef.current) {
      ticketDescargadoRef.current = true;
      descargarTicket();
    }
  }, [venta]);

  if (cargando) {
    return (
      <div className="confirmacion-page">
        <div className="confirmacion-card">
          <div className="confirmacion-loader" />
          <h2>Estamos procesando tu compra</h2>
          <p>Por favor, espera mientras registramos tu pedido.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confirmacion-page">
        <div className="confirmacion-card">
          <h2>No pudimos completar tu compra</h2>
          <p className="confirmacion-error">{error}</p>
          <button onClick={() => navigate("/datos-compra")}>
            Regresar a datos de compra
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmacion-page">
      <div className="confirmacion-card">
        <div className="confirmacion-icon">
          <CheckCircle2 size={54} />
        </div>

        <h1>¡Gracias por tu compra!</h1>
        <p className="confirmacion-mensaje">
          Tu pedido se registró correctamente.
        </p>

        <div className="confirmacion-folio">
          <span>Folio de compra</span>
          <strong>#{venta.id}</strong>
        </div>

        <div className="confirmacion-resumen">
          <div>
            <ShoppingBag size={19} />
            <strong>Resumen de tu pedido</strong>
          </div>

          {datosCompra.items.map((item) => (
            <div className="confirmacion-producto" key={item.id}>
              <span>
                {item.nombre} × {item.cantidad}
              </span>
              <strong>
                ${(Number(item.precio) * item.cantidad).toFixed(2)}
              </strong>
            </div>
          ))}

          <div className="confirmacion-total">
            <span>Total pagado</span>
            <strong>
              ${Number(venta.total ?? datosCompra.total).toFixed(2)}
            </strong>
          </div>
        </div>

        <p className="confirmacion-nota">
          Esta compra es una demostración. No se realizó ningún cobro real.
        </p>

        <button className="confirmacion-descargar" onClick={descargarTicket}>
          <Download size={18} />
          Descargar ticket PDF
        </button>

        <button
          className="confirmacion-inicio"
          onClick={() => navigate("/catalogo")}
        >
          <Home size={18} />
          Volver al catálogo
        </button>
      </div>
    </div>
  );
}

export default ConfirmacionCompra;
