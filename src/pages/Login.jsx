
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import { apiRequest } from "../services/api";
import "../styles/Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const data = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            });

            // Guardar el token JWT
            localStorage.setItem("cina_token", data.token);

            // Guardar los datos del usuario
            localStorage.setItem("cina_user", JSON.stringify({
                id: data.id,
                email: data.email,
                role: data.role
            }));

            setError("");
            navigate("/calendario");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="logo">
                    <img src={logo} alt="CINA Wellness" />
                </div>

                <h2>Iniciar sesión</h2>

                {error && <p className="error">{error}</p>}

                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
