import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import "./Login.css";

const API_URL = import.meta.env.CINA_API_URL;

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
            const response = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error("Credenciales inválidas");
            }

            const message = await response.text();
            alert(message);
            navigate("/calendario");
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">            
            <form className="login-form" onSubmit={handleSubmit}>
                <div class="logo">
                    <img src={logo} alt="Cona Wellness"/>
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
