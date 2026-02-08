import { useState } from "react";
import "./Login.css";

const API_URL = import.meta.env.CINA_API_URL;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/auth/login`, {
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
            console.log(message);

            setError("");
            alert("Login exitoso");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
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
