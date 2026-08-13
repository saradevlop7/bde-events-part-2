import { useState } from "react";
import api from "./services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            alert("Connexion réussie !");

            // Redirection après connexion
            if (response.data.user?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/student/dashboard");
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Email ou mot de passe incorrect"
            );
        }
    };

    return (
        <div className="login-page">

            {/* Partie gauche */}
            <div className="login-left">

                <div className="logo">
                    <div className="logo-box">B</div>
                    <span>BDE-Events</span>
                </div>

                <div className="left-content">

                    <span className="tag">
                        CAMPUS • EVENTS • EXPERIENCE
                    </span>

                    <h1>
                        Vivez vos événements
                        <span> autrement.</span>
                    </h1>

                    <p>
                        Découvrez les événements de votre campus,
                        réservez votre place et profitez pleinement
                        de chaque expérience.
                    </p>

                    <div className="features">

                        <div className="feature">
                            <div className="feature-icon">🎓</div>

                            <div>
                                <strong>Événements campus</strong>
                                <small>
                                    Découvrez les prochains événements
                                </small>
                            </div>
                        </div>

                        <div className="feature">
                            <div className="feature-icon">🎟️</div>

                            <div>
                                <strong>Billet numérique</strong>
                                <small>
                                    Gardez vos réservations avec vous
                                </small>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="copyright">
                    © 2026 BDE-Events
                </div>

            </div>

            {/* Partie droite */}
            <div className="login-right">

                <div className="login-card">

                    <div className="mobile-logo">
                        <div className="logo-box">B</div>
                        <span>BDE-Events</span>
                    </div>

                    <div className="header">

                        <span className="welcome">
                            BIENVENUE 👋
                        </span>

                        <h2>
                            Connexion
                        </h2>

                        <p>
                            Connectez-vous à votre espace étudiant.
                        </p>

                    </div>

                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="form-group">

                            <label>
                                Adresse email
                            </label>

                            <div className="input-box">

                                <span>✉</span>

                                <input
                                    type="email"
                                    placeholder="student@bde.test"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        </div>

                        {/* Password */}
                        <div className="form-group">

                            <div className="password-header">

                                <label>
                                    Mot de passe
                                </label>

                                <button
                                    type="button"
                                    className="forgot"
                                    onClick={() => {
                                        // À connecter plus tard
                                    }}
                                >
                                    Mot de passe oublié ?
                                </button>

                            </div>

                            <div className="input-box">

                                <span>🔒</span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    className="eye"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>

                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="error-message">
                                <span>!</span>
                                {error}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            className="login-button"
                        >
                            Se connecter
                            <span>→</span>
                        </button>

                    </form>

                    <div className="secure">
                        🔐 Connexion sécurisée
                    </div>

                    <div className="register">
                        Vous n'avez pas encore de compte ?

                        <button type="button">
                            Créer un compte
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
