import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Footprints,
  HandHeart,
  Sparkles,
  MessageCircle,
  Send,
  X,
  ChevronDown,
  MapPin,
  Phone,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/inicio.css";
import logo from "../img/logo.png";

const preguntas = [
  {
    pregunta: "¿Qué servicios ofrece CINA Wellness?",
    respuesta:
      "Ofrecemos servicios de podología y cuidado personal, enfocados en el bienestar y la atención de nuestros clientes.",
  },
  {
    pregunta: "¿Cómo puedo agendar una cita?",
    respuesta:
      "Puedes consultar la sección Citas desde el menú de la plataforma para revisar la disponibilidad y solicitar tu espacio.",
  },
  {
    pregunta: "¿Puedo comprar productos desde la plataforma?",
    respuesta:
      "Sí. En nuestro catálogo puedes consultar los productos disponibles, agregarlos al carrito y completar tu pedido de demostración.",
  },
  {
    pregunta: "¿Cómo puedo conocer la disponibilidad de un producto?",
    respuesta:
      "En el catálogo encontrarás los productos y sus existencias disponibles. También puedes consultar su información desde el detalle de cada producto.",
  },
  {
    pregunta: "¿Cómo puedo comunicarme con CINA Wellness?",
    respuesta:
      "Puedes utilizar nuestro formulario de contacto o el chat de demostración disponible en esta página.",
  },
];

const mensajesIniciales = [
  {
    tipo: "bot",
    texto:
      "¡Hola! Bienvenido a CINA Wellness. Estamos aquí para ayudarte. ¿Qué te gustaría consultar?",
  },
];

function Inicio() {
  const [preguntaAbierta, setPreguntaAbierta] = useState(0);
  const [chatAbierto, setChatAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [contacto, setContacto] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });
  const [contactoEnviado, setContactoEnviado] = useState(false);
  const navigate = useNavigate();

  // Mantiene la navegación dentro de React Router y evita recargar la página.
  const navegarInternamente = (ruta) => (e) => {
    e.preventDefault();
    navigate(ruta);
  };
  const enviarMensaje = (e) => {
    e.preventDefault();

    const texto = mensaje.trim();
    if (!texto) return;

    setMensajes((anteriores) => [
      ...anteriores,
      { tipo: "usuario", texto },
      {
        tipo: "bot",
        texto:
          "¡Gracias por escribirnos! Este es un chat de demostración. Para recibir atención personalizada, utiliza nuestro formulario de contacto.",
      },
    ]);

    setMensaje("");
  };

  const actualizarContacto = (e) => {
    const { name, value } = e.target;

    setContacto((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const enviarContacto = (e) => {
    e.preventDefault();
    setContactoEnviado(true);

    setContacto({
      nombre: "",
      correo: "",
      telefono: "",
      asunto: "",
      mensaje: "",
    });
  };

  return (
    <div className="inicio-page">
      {/* PORTADA */}
      <section className="inicio-hero">
        <div className="inicio-hero-content">
          <span className="inicio-eyebrow">
            <Sparkles size={15} />
            Bienestar y cuidado personal
          </span>

          <h1>
            Cada paso hacia
            <br />
            tu bienestar <span>importa.</span>
          </h1>

          <p>
            En CINA Wellness cuidamos de ti con atención especializada,
            productos seleccionados y un compromiso con tu bienestar.
          </p>

          <div className="inicio-hero-actions">
            <a href="#nosotros" className="inicio-btn-primary">
              Conócenos
              <ArrowRight size={17} />
            </a>

            <a href="#servicios" className="inicio-btn-secondary">
              Nuestros servicios
            </a>
          </div>

          <div className="inicio-hero-note">
            <Heart size={17} />
            <span>Cuidamos cada paso de tu bienestar</span>
          </div>
        </div>

        <div className="inicio-hero-visual">
          <div className="inicio-hero-circle">
            <img src={logo} alt="CINA Wellness" />
          </div>

          <div className="inicio-floating-card">
            <Sparkles size={20} />
            <div>
              <strong>Tu bienestar</strong>
              <span>Es nuestra prioridad</span>
            </div>
          </div>

          <div className="inicio-hero-decoration inicio-decoration-one" />
          <div className="inicio-hero-decoration inicio-decoration-two" />
        </div>
      </section>

      {/* ACCESOS RAPIDOS */}
      <section className="inicio-quick-access">
        <a
          href="/citas"
          onClick={navegarInternamente("/citas")}
          className="inicio-quick-card"
        >
          <div className="inicio-quick-icon">
            <CalendarDays size={23} />
          </div>
          <div>
            <strong>Agenda tu cita</strong>
            <span>Consulta disponibilidad</span>
          </div>
          <ArrowRight size={18} />
        </a>

        <a
          href="/catalogo"
          onClick={navegarInternamente("/catalogo")}
          className="inicio-quick-card"
        >
          <div className="inicio-quick-icon">
            <ShoppingBag size={23} />
          </div>
          <div>
            <strong>Explora la tienda</strong>
            <span>Conoce nuestros productos</span>
          </div>
          <ArrowRight size={18} />
        </a>

        <a href="#contacto" className="inicio-quick-card">
          <div className="inicio-quick-icon">
            <MessageCircle size={23} />
          </div>
          <div>
            <strong>Contáctanos</strong>
            <span>Estamos para ayudarte</span>
          </div>
          <ArrowRight size={18} />
        </a>
      </section>

      {/* QUIENES SOMOS */}
      <section className="inicio-section inicio-about" id="nosotros">
        <div className="inicio-section-heading">
          <span className="inicio-eyebrow">CONOCE CINA WELLNESS</span>
          <h2>Un espacio dedicado a tu bienestar</h2>
          <p>
            Trabajamos para ofrecer una experiencia de cuidado personal cercana,
            profesional y de calidad.
          </p>
        </div>

        <div className="inicio-about-content">
          <div className="inicio-about-mark">
            <img src={logo} alt="Logotipo CINA Wellness" />
            <span>Bienestar en cada paso</span>
          </div>

          <div className="inicio-about-text">
            <h3>¿Quiénes somos?</h3>
            <p>
              CINA Wellness es un espacio dedicado al cuidado de los pies y las
              manos. Buscamos que cada persona encuentre atención, orientación y
              productos que contribuyan a su bienestar.
            </p>
            <p>
              Nuestro compromiso es brindar una atención amable y personalizada,
              cuidando cada detalle de la experiencia de nuestros clientes.
            </p>

            <div className="inicio-values">
              <div>
                <Heart size={19} />
                <span>Atención humana</span>
              </div>
              <div>
                <ShieldCheck size={19} />
                <span>Compromiso y calidad</span>
              </div>
              <div>
                <Sparkles size={19} />
                <span>Bienestar integral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISION Y VISION */}
      <section className="inicio-purpose">
        <article className="inicio-purpose-card">
          <div className="inicio-purpose-icon">
            <HandHeart size={27} />
          </div>
          <span>NUESTRA ESENCIA</span>
          <h3>Misión</h3>
          <p>
            Brindar servicios y productos para el cuidado personal, mediante una
            atención cercana y responsable que contribuya al bienestar de
            nuestros clientes.
          </p>
        </article>

        <article className="inicio-purpose-card">
          <div className="inicio-purpose-icon">
            <Footprints size={27} />
          </div>
          <span>NUESTRO CAMINO</span>
          <h3>Visión</h3>
          <p>
            Ser un espacio de referencia en el cuidado de pies y manos,
            reconocido por la calidad de nuestros servicios, la confianza y la
            satisfacción de nuestros clientes.
          </p>
        </article>

        <article className="inicio-purpose-card">
          <div className="inicio-purpose-icon">
            <ShieldCheck size={27} />
          </div>
          <span>NUESTRO COMPROMISO</span>
          <h3>Calidad</h3>
          <p>
            Mantener una atención respetuosa, ordenada y orientada a las
            necesidades de cada cliente, procurando mejorar continuamente
            nuestros servicios.
          </p>
        </article>
      </section>

      {/* SERVICIOS */}
      <section className="inicio-section" id="servicios">
        <div className="inicio-section-heading">
          <span className="inicio-eyebrow">CUIDAMOS DE TI</span>
          <h2>Nuestros servicios</h2>
          <p>
            Atención y productos para acompañarte en tu rutina de cuidado
            personal.
          </p>
        </div>

        <div className="inicio-services">
          <article className="inicio-service-card">
            <div className="inicio-service-icon">
              <Footprints size={30} />
            </div>
            <h3>Podología</h3>
            <p>
              Atención enfocada en el cuidado, la salud y el bienestar de tus
              pies.
            </p>
          </article>

          <article className="inicio-service-card">
            <div className="inicio-service-icon">
              <HandHeart size={30} />
            </div>
            <h3>Manicure</h3>
            <p>Cuidado personal de manos y uñas con atención a cada detalle.</p>
          </article>

          <article className="inicio-service-card">
            <div className="inicio-service-icon">
              <ShoppingBag size={30} />
            </div>
            <h3>Productos de cuidado</h3>
            <p>
              Consulta nuestro catálogo y encuentra productos para tu cuidado
              personal.
            </p>
          </article>
        </div>
      </section>
      {/* VIDEO DE PRESENTACION */}
      <section className="inicio-section inicio-video" id="video">
        <div className="inicio-section-heading">
          <span className="inicio-eyebrow">CONOCE NUESTRA PLATAFORMA</span>
          <h2>Descubre CINA Wellness</h2>
          <p>
            Conoce nuestra plataforma y descubre cómo puedes consultar
            productos, gestionar tus citas y realizar compras de demostración de
            manera sencilla desde un solo lugar.
          </p>
        </div>

        <div className="inicio-video-container">
          <iframe
            src="https://www.youtube.com/embed/4WjL-DY7uxM"
            title="Presentación y funcionamiento de CINA Wellness"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <p className="inicio-video-caption">
          CINA Wellness: cuidamos cada paso de tu bienestar.
        </p>
      </section>
      {/* POLITICAS */}
      <section className="inicio-quality">
        <div>
          <span className="inicio-eyebrow">NUESTRO COMPROMISO</span>
          <h2>Tu confianza es importante para nosotros.</h2>
          <p>
            Procuramos ofrecer un servicio responsable, una comunicación clara y
            una experiencia de atención respetuosa.
          </p>
        </div>

        <ul>
          <li>
            <CheckCircle2 size={19} />
            Atención amable y personalizada.
          </li>
          <li>
            <CheckCircle2 size={19} />
            Respeto y confidencialidad de la información.
          </li>
          <li>
            <CheckCircle2 size={19} />
            Información clara sobre servicios y productos.
          </li>
          <li>
            <CheckCircle2 size={19} />
            Mejora continua en la atención.
          </li>
        </ul>
      </section>

      {/* PREGUNTAS FRECUENTES */}
      <section className="inicio-section inicio-faq" id="preguntas">
        <div className="inicio-section-heading">
          <span className="inicio-eyebrow">PODEMOS AYUDARTE</span>
          <h2>Preguntas frecuentes</h2>
          <p>Resolvemos algunas de las dudas más comunes.</p>
        </div>

        <div className="inicio-faq-list">
          {preguntas.map((item, index) => (
            <article
              className={`inicio-faq-item ${
                preguntaAbierta === index ? "abierta" : ""
              }`}
              key={item.pregunta}
            >
              <button
                type="button"
                onClick={() =>
                  setPreguntaAbierta(preguntaAbierta === index ? -1 : index)
                }
              >
                <span>{item.pregunta}</span>
                <ChevronDown size={20} />
              </button>

              {preguntaAbierta === index && <p>{item.respuesta}</p>}
            </article>
          ))}
        </div>
      </section>

      {/* UBICACION */}
      <section className="inicio-location">
        <div className="inicio-location-icon">
          <MapPin size={28} />
        </div>
        <div className="inicio-location-info">
          <span className="inicio-eyebrow">VISÍTANOS</span>
          <h2>Estamos para atenderte</h2>
          <p>Avenida República 1558, Guadalajara, Jalisco.</p>
          <p className="inicio-location-note">
            Conoce nuestra ubicación y agenda una visita. Será un gusto
            atenderte.
          </p>
        </div>
        <button type="button" onClick={() => navigate("/citas")}>
          Consultar citas
          <ArrowRight />
        </button>
        <div className="inicio-map">
          <iframe
            title="Ubicación de CINA Wellness en Google Maps"
            src="https://www.google.com/maps?q=Avenida+Rep%C3%BAblica+1558,+Guadalajara,+Jalisco&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      {/* CONTACTO */}
      <section className="inicio-section inicio-contact" id="contacto">
        <div className="inicio-contact-info">
          <span className="inicio-eyebrow">HABLEMOS</span>
          <h2>Nos encantará saber de ti.</h2>
          <p>
            ¿Tienes alguna duda o deseas recibir más información? Déjanos tus
            datos y tu mensaje.
          </p>

          <a
            className="inicio-contact-detail"
            href="https://wa.me/523316224056"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={19} />
            <span>WhatsApp: 33 1622 4056</span>
          </a>
          <a className="inicio-contact-detail" href="tel:+523331559999">
            <Phone size={19} />
            <span>Teléfono: 33 3155 9999</span>
          </a>
          <a
            className="inicio-contact-detail"
            href="https://cinaenmovimiento.com"
            target="_blank"
            rel="noreferrer"
          >
            <Globe size={19} />
            <span>cinaenmovimiento.com</span>
          </a>
          <div className="inicio-contact-detail">
            <MapPin size={19} />
            <span>Avenida República 1558, Guadalajara, Jalisco</span>
          </div>
        </div>

        <form className="inicio-contact-form" onSubmit={enviarContacto}>
          <h3>Contáctanos</h3>

          {contactoEnviado && (
            <div className="inicio-contact-success">
              <CheckCircle2 size={18} />
              Mensaje enviado en modo demostración.
            </div>
          )}

          <div className="inicio-form-row">
            <label>
              Nombre completo
              <input
                type="text"
                name="nombre"
                value={contacto.nombre}
                onChange={actualizarContacto}
                placeholder="Tu nombre"
                required
              />
            </label>

            <label>
              Correo electrónico
              <input
                type="email"
                name="correo"
                value={contacto.correo}
                onChange={actualizarContacto}
                placeholder="correo@ejemplo.com"
                required
              />
            </label>
          </div>

          <div className="inicio-form-row">
            <label>
              Teléfono
              <input
                type="tel"
                name="telefono"
                value={contacto.telefono}
                onChange={actualizarContacto}
                placeholder="Tu teléfono"
              />
            </label>

            <label>
              Asunto
              <input
                type="text"
                name="asunto"
                value={contacto.asunto}
                onChange={actualizarContacto}
                placeholder="Motivo de contacto"
                required
              />
            </label>
          </div>

          <label>
            Mensaje
            <textarea
              name="mensaje"
              value={contacto.mensaje}
              onChange={actualizarContacto}
              placeholder="Escribe tu mensaje..."
              rows="4"
              required
            />
          </label>

          <button type="submit" className="inicio-btn-primary">
            Enviar mensaje
            <Send size={17} />
          </button>

          <small>
            Formulario de demostración. No se envían datos a un servidor.
          </small>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="inicio-footer">
        <div className="inicio-footer-brand">
          <img src={logo} alt="CINA Wellness" />
          <p>Cuidamos cada paso de tu bienestar.</p>
        </div>

        <div className="inicio-footer-links">
          <strong>Explora</strong>
          <a href="#nosotros">Quiénes somos</a>
          <a href="#servicios">Servicios</a>
          <a href="#preguntas">Preguntas frecuentes</a>
          <a href="/catalogo" onClick={navegarInternamente("/catalogo")}>
            Catálogo
          </a>
        </div>

        <div className="inicio-footer-links">
          <strong>Contacto</strong>
          <a href="#contacto">Formulario de contacto</a>
          <a href="/citas" onClick={navegarInternamente("/citas")}>
            Agenda tu cita
          </a>
          <span>Avenida República 1558, Guadalajara, Jalisco</span>
        </div>

        <div className="inicio-footer-social">
          <strong>Síguenos</strong>
          <div>
            <a
              href="https://www.facebook.com/profile.php?id=61565477101751&locale=es_LA"
              target="_blank"
              rel="noreferrer"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className="inicio-footer-bottom">
          © {new Date().getFullYear()} CINA Wellness. Todos los derechos
          reservados.
        </div>
      </footer>

      {/* BOTON FLOTANTE DE CHAT */}
      <button
        type="button"
        className="inicio-chat-float"
        onClick={() => setChatAbierto(true)}
        aria-label="Abrir chat"
      >
        <MessageCircle size={23} />
        <span>¿Necesitas ayuda?</span>
      </button>

      {/* MODAL DE CHAT */}
      {chatAbierto && (
        <div
          className="inicio-chat-overlay"
          onClick={() => setChatAbierto(false)}
        >
          <section
            className="inicio-chat-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Chat de CINA Wellness"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="inicio-chat-header">
              <div className="inicio-chat-avatar">
                <MessageCircle size={22} />
              </div>
              <div>
                <strong>Atención CINA Wellness</strong>
                <span>
                  <i /> En línea · Chat de demostración
                </span>
              </div>
              <button
                type="button"
                onClick={() => setChatAbierto(false)}
                aria-label="Cerrar chat"
              >
                <X size={21} />
              </button>
            </header>

            <div className="inicio-chat-messages">
              <div className="inicio-chat-date">Hoy</div>

              {mensajes.map((item, index) => (
                <div key={index} className={`inicio-chat-message ${item.tipo}`}>
                  {item.texto}
                </div>
              ))}
            </div>

            <form className="inicio-chat-input" onSubmit={enviarMensaje}>
              <input
                type="text"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escribe tu mensaje..."
              />
              <button type="submit" aria-label="Enviar mensaje">
                <Send size={19} />
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Inicio;
