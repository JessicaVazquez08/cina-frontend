import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Inicio from "./pages/Inicio";
import Calendario from "./pages/Calendario";
import Inventario from "./pages/Inventario";
import Ventas from "./pages/Ventas";
import Catalogo from "./pages/Catalogo";
import DatosCompra from "./pages/DatosCompra";
import Carrito from "./pages/Carrito";
import ConfirmacionCompra from "./pages/ConfirmacionCompra";

import { CarritoProvider } from "./context/CarritoContext";

function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/inicio" element={<Inicio />} />

              <Route element={<ProtectedRoute rolesPermitidos={["ADMIN"]} />}>
                <Route path="/inventario" element={<Inventario />} />
              </Route>

              <Route path="/catalogo" element={<Catalogo />} />

              <Route path="/carrito" element={<Carrito />} />
              <Route path="/datos-compra" element={<DatosCompra />} />
              <Route
                path="/confirmacion-compra"
                element={<ConfirmacionCompra />}
              />

              <Route element={<ProtectedRoute rolesPermitidos={["ADMIN"]} />}>
                <Route path="/ventas" element={<Ventas />} />
              </Route>

              <Route path="/citas" element={<Calendario />} />

              <Route
                path="/calendario"
                element={<Navigate to="/citas" replace />}
              />

              <Route path="*" element={<Navigate to="/inicio" replace />} />
            </Route>
          </Route>
        </Routes>
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default App;
