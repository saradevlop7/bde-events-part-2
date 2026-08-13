import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../pages/services/api";
import "./login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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

            const role = response.data.user.role;

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else if (role === "student") {
                navigate("/dashboard");
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

            {/* LEFT */}
            <div className="login-left">
                <div className="brand">
                    <div className="brand-icon">B</div>
                    <span>BDE-Events</span>
                </div>

                <div className="badge">
                    CAMPUS • EVENTS • EXPERIENCE
                </div>

                <h1>
                    Vivez vos
                    <br />
                    événements
                    <br />
                    <span>autrement.</span>
                </h1>

                <p className="description">
                    Découvrez les événements de votre campus,
                    réservez votre place et profitez pleinement
                    de chaque expérience.
                </p>

                <div className="features">
                    <div className="feature">
                        <span>🎓</span>
                        <div>
                            <strong>Événements campus</strong>
                            <small>Découvrez les prochains événements</small>
                        </div>
                    </div>

                    <div className="feature">
                        <span>🎟️</span>
                        <div>
                            <strong>Billet numérique</strong>
                            <small>Gardez vos réservations avec vous</small>
                        </div>
                    </div>
                </div>

                <p className="copyright">
                    © 2026 BDE-Events
                </p>
            </div>

            {/* RIGHT */}
            <div className="login-right">
                <div className="login-box">

                    <div className="welcome">
                        BIENVENUE 👋
                    </div>

                    <h2>Connexion</h2>

                    <p className="subtitle">
                        Connectez-vous à votre espace étudiant.
                    </p>

                    <form onSubmit={handleLogin}>

                        <label>Adresse email</label>

                        <div className="input-group">
                            <span>✉️</span>

                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="password-label">
                            <label>Mot de passe</label>
                            <a href="#">Mot de passe oublié ?</a>
                        </div>

                        <div className="input-group">
                            <span>🔒</span>

                            <input
                                type="password"
                                placeholder="Votre mot de passe"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                        </div>

                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}

                        <button type="submit">
                            Se connecter
                            <span>→</span>
                        </button>
                    </form>

                    <div className="secure">
                        🔒 Connexion sécurisée
                    </div>

                    <p className="register">
                        Vous n'avez pas encore de compte ?
                        <a href="#">Créer un compte</a>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Login;
