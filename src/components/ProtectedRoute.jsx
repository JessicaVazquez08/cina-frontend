
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ rolesPermitidos }) {

    const token = localStorage.getItem("cina_token");
    const usuarioGuardado = localStorage.getItem("cina_user");

    if (!token || !usuarioGuardado) {
        return <Navigate to="/" replace />;
    }

    let usuario;

    try {
        usuario = JSON.parse(usuarioGuardado);
    } catch {
        localStorage.removeItem("cina_token");
        localStorage.removeItem("cina_user");

        return <Navigate to="/" replace />;
    }

    if (
        rolesPermitidos &&
        !rolesPermitidos.includes(usuario.role)
    ) {
        return <Navigate to="/calendario" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;