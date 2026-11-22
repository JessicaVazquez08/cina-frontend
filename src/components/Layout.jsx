import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  House,
  Boxes,
  ShoppingBag,
  ShoppingCart,
  CalendarDays,
  LogOut,
} from "lucide-react";

import "../styles/Layout.css";
import logo from "../img/logo.png";
import { useCarrito } from "../context/CarritoContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalArticulos } = useCarrito();

  const usuario = JSON.parse(localStorage.getItem("cina_user") || "{}");
  const esAdmin = usuario.role === "ADMIN";

  const logout = () => {
    localStorage.removeItem("cina_token");
    localStorage.removeItem("cina_user");
    navigate("/", { replace: true });
  };

  const menu = [
    { nombre: "Inicio", ruta: "/inicio", Icono: House },
    ...(esAdmin
      ? [{ nombre: "Inventarios", ruta: "/inventario", Icono: Boxes }]
      : []),
    { nombre: "Catálogo", ruta: "/catalogo", Icono: ShoppingBag },
    { nombre: "Carrito", ruta: "/carrito", Icono: ShoppingCart },
    { nombre: "Citas", ruta: "/citas", Icono: CalendarDays },
  ];

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Cina Wellness" />
        </div>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">
          {menu.map(({ nombre, ruta, Icono }) => (
            <button
              key={ruta}
              className={
                location.pathname === ruta ? "menu-item active" : "menu-item"
              }
              onClick={() => navigate(ruta)}
            >
              <Icono size={23} strokeWidth={1.8} />
              <span>{nombre}</span>

              {nombre === "Carrito" && totalArticulos > 0 && (
                <span className="menu-cart-count">{totalArticulos}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-decoration">
          <img src="/src/img/hojas-cina.svg" alt="" />
          <p>
            Cuidamos
            <br />
            cada paso
            <br />
            de tu bienestar
          </p>
        </div>

        <div className="logout">
          <button onClick={logout}>
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
