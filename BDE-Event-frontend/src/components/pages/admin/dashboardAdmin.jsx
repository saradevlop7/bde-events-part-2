import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DashboardAdmin() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        events: 0,
        students: 0,
        bookings: 0,
        tickets: 0,
    });

    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "Admin",
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const getStats = async () => {
            try {
                const response = await api.get("/admin/events/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Stats API:", response.data);

                setStats({
                    events: response.data.events || 0,
                    students: response.data.students || 0,
                    bookings: response.data.bookings || 0,
                    tickets: response.data.tickets || 0,
                });
            } catch (error) {
                console.error("Erreur stats:", error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        getStats();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <style>{`
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    font-family: Arial, Helvetica, sans-serif;
                    background: #eff6ff;
                }

                .admin-page {
                    min-height: 100vh;
                    display: flex;
                    background: #eff6ff;
                }

                .admin-sidebar {
                    width: 250px;
                    min-height: 100vh;
                    background: linear-gradient(
                        180deg,
                        #2563eb,
                        #3b82f6
                    );
                    color: white;
                    padding: 35px 25px;
                    position: fixed;
                    left: 0;
                    top: 0;
                    bottom: 0;
                }

                .logo-circle {
                    width: 90px;
                    height: 90px;
                    margin: 0 auto 20px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 42px;
                }

                .logo-title {
                    text-align: center;
                    font-size: 25px;
                    font-weight: 700;
                    margin-bottom: 55px;
                }

                .admin-menu {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .admin-menu button {
                    border: none;
                    background: transparent;
                    color: white;
                    text-align: left;
                    padding: 13px 10px;
                    font-size: 17px;
                    cursor: pointer;
                    border-radius: 10px;
                }

                .admin-menu button:hover {
                    background: rgba(255,255,255,0.15);
                }

                .logout-button {
                    margin-top: 45px;
                    width: 100%;
                    padding: 13px;
                    border: none;
                    border-radius: 10px;
                    background: white;
                    color: #2563eb;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .admin-content {
                    margin-left: 250px;
                    width: calc(100% - 250px);
                    padding: 50px;
                }

                .welcome-card {
                    background: white;
                    border-radius: 20px;
                    padding: 35px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                    margin-bottom: 30px;
                }

                .welcome-card h1 {
                    margin: 0 0 10px;
                    color: #2563eb;
                    font-size: 30px;
                }

                .welcome-card p {
                    margin: 0;
                    color: #555;
                    font-size: 17px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 22px;
                }

                .stat-card {
                    background: white;
                    padding: 28px;
                    border-radius: 18px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                    border-left: 5px solid #3b82f6;
                }

                .stat-icon {
                    font-size: 28px;
                    margin-bottom: 15px;
                }

                .stat-card h3 {
                    margin: 0 0 10px;
                    color: #444;
                    font-size: 17px;
                }

                .stat-number {
                    margin: 0;
                    color: #2563eb;
                    font-size: 38px;
                    font-weight: 700;
                }

                .actions {
                    margin-top: 30px;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 22px;
                }

                .action-card {
                    background: white;
                    border-radius: 18px;
                    padding: 25px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                }

                .action-card h2 {
                    margin-top: 0;
                    color: #2563eb;
                }

                .action-card button {
                    border: none;
                    background: #3b82f6;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 9px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 15px;
                }

                .action-card button:hover {
                    background: #2563eb;
                }

                .loading {
                    text-align: center;
                    padding: 30px;
                    color: #2563eb;
                    font-size: 18px;
                }

                @media (max-width: 1000px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 700px) {
                    .admin-sidebar {
                        width: 100%;
                        height: auto;
                        min-height: auto;
                        position: relative;
                    }

                    .admin-page {
                        display: block;
                    }

                    .admin-content {
                        margin-left: 0;
                        width: 100%;
                        padding: 25px;
                    }

                    .stats-grid,
                    .actions {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="admin-page">

                <aside className="admin-sidebar">

                    <div className="logo-circle">
                        🎓
                    </div>

                    <div className="logo-title">
                        BDE Events
                    </div>

                    <div className="admin-menu">

                        <button onClick={() => navigate("/admin/dashboard")}>
                            🏠 Dashboard
                        </button>

                        <button>
                            ➕ Ajouter événement
                        </button>

                        <button>
                            📅 Événements
                        </button>

                        <button>
                            🎟️ Réservations
                        </button>

                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Déconnexion
                    </button>

                </aside>

                <main className="admin-content">

                    <div className="welcome-card">
                        <h1>
                            Bonjour {user.name} 👋
                        </h1>

                        <p>
                            Gérez les événements et les réservations
                            depuis votre espace administrateur.
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading">
                            Chargement des statistiques...
                        </div>
                    ) : (
                        <div className="stats-grid">

                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <h3>Événements</h3>
                                <p className="stat-number">
                                    {stats.events}
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <h3>Étudiants</h3>
                                <p className="stat-number">
                                    {stats.students}
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🎟️</div>
                                <h3>Réservations</h3>
                                <p className="stat-number">
                                    {stats.bookings}
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">🎫</div>
                                <h3>Tickets</h3>
                                <p className="stat-number">
                                    {stats.tickets}
                                </p>
                            </div>

                        </div>
                    )}

                    <div className="actions">

                        <div className="action-card">
                            <h2>📅 Événements</h2>

                            <p>
                                Consultez et gérez les événements du BDE.
                            </p>

                            <button>
                                Gérer les événements
                            </button>
                        </div>

                        <div className="action-card">
                            <h2>➕ Nouveau événement</h2>

                            <p>
                                Ajoutez un nouvel événement pour les étudiants.
                            </p>

                            <button>
                                Ajouter événement
                            </button>
                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}

export default DashboardAdmin
