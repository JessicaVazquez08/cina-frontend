import React from "react";

function TicketModal({ venta, onClose }) {  
  const imprimir = () => {
    window.print();
  };

  return (
    <div className="pos-modal">

      <div className="pos-ticket">

        <button className="pos-close" onClick={onClose}>×</button>

        <div className="ticket-print">

          <h3>CINA S.A. de C.V</h3>
          <p>Av. Siempre Viva 123, Guadalajara</p>
          <p>Tel: 33-1234-5678</p>
          <p>Email: contacto@cina.com</p>

          <hr />

          <p>Fecha: {new Date().toLocaleString()}</p>

          <hr />

          {venta.detalles.map((d, i) => (
            <div key={i} className="ticket-row">
              <span>{d.nombre}</span>
              <span>{d.cantidad} x ${d.precio}</span>
            </div>
          ))}

          <hr />

          <h3>Total: ${venta.total}</h3>

        </div>

        <button className="pos-btn" onClick={imprimir}>
          Imprimir
        </button>

      </div>

    </div>
  );
}

export default TicketModal;