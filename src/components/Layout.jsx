import { Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";
import logo from "../img/logo.png";

function Layout() {

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <div className="layout-container">

      <aside className="sidebar">
        <div class="logo">
            <img src={logo} alt="Cona Wellness"/>
        </div>
        <h2 className="logo">Cina Wellness</h2>

        <nav>

          <button onClick={() => navigate("/calendario")}>
            Calendario
          </button>

          <button onClick={() => navigate("/inventario")}>
            Inventario
          </button>

          <button onClick={() => navigate("/ventas")}>
            Ventas
          </button>

        </nav>

        <div className="logout">
          <button onClick={logout}>Cerrar sesión</button>
        </div>

      </aside>

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;