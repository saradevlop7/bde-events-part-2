import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StudentDashboard() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "Étudiant",
        email: "",
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const getEvents = async () => {
            try {
                const response = await api.get("/events", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Events API:", response.data);

                setEvents(
                    response.data.data ||
                    response.data ||
                    []
                );
            } catch (err) {
                console.error("Erreur events:", err);

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                    return;
                }


            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, [navigate]);

    const bookEvent = async (eventId) => {
        try {
            const token = localStorage.getItem("token");

            await api.post(
                `/events/${eventId}/book`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Réservation effectuée avec succès 🎉");

        } catch (err) {
            console.error("Erreur réservation:", err);

            alert(
                err.response?.data?.message ||
                "Impossible d'effectuer la réservation."
            );
        }
    };

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

                .student-page {
                    min-height: 100vh;
                    display: flex;
                    background: #eff6ff;
                }

                /* ================= SIDEBAR ================= */

                .student-sidebar {
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

                .student-logo-circle {
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

                .student-logo-title {
                    text-align: center;

                    font-size: 25px;
                    font-weight: 700;

                    margin-bottom: 55px;
                }

                .student-menu {
                    display: flex;
                    flex-direction: column;

                    gap: 18px;
                }

                .student-menu button {
                    border: none;
                    background: transparent;

                    color: white;

                    text-align: left;

                    padding: 13px 10px;

                    font-size: 17px;

                    cursor: pointer;

                    border-radius: 10px;

                    transition: 0.2s;
                }

                .student-menu button:hover {
                    background: rgba(255,255,255,0.15);
                }

                .student-menu button.active {
                    background: rgba(255,255,255,0.20);
                }

                .student-logout {
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

                /* ================= CONTENT ================= */

                .student-content {
                    margin-left: 250px;

                    width: calc(100% - 250px);

                    padding: 50px;
                }

                /* ================= WELCOME ================= */

                .student-welcome {
                    background: white;

                    border-radius: 20px;

                    padding: 35px;

                    box-shadow:
                        0 8px 25px rgba(0,0,0,0.06);

                    margin-bottom: 30px;
                }

                .student-welcome h1 {
                    margin: 0 0 10px;

                    color: #2563eb;

                    font-size: 30px;
                }

                .student-welcome p {
                    margin: 0;

                    color: #555;

                    font-size: 17px;
                }

                /* ================= STATS ================= */

                .student-stats {
                    display: grid;

                    grid-template-columns:
                        repeat(3, 1fr);

                    gap: 22px;
                }

                .student-stat-card {
                    background: white;

                    padding: 28px;

                    border-radius: 18px;

                    box-shadow:
                        0 8px 25px rgba(0,0,0,0.06);

                    border-left: 5px solid #3b82f6;
                }

                .student-stat-icon {
                    font-size: 28px;

                    margin-bottom: 15px;
                }

                .student-stat-card h3 {
                    margin: 0 0 10px;

                    color: #444;

                    font-size: 17px;
                }

                .student-stat-number {
                    margin: 0;

                    color: #2563eb;

                    font-size: 38px;

                    font-weight: 700;
                }

                /* ================= EVENTS ================= */

                .student-events {
                    background: white;

                    border-radius: 18px;

                    padding: 30px;

                    margin-top: 30px;

                    box-shadow:
                        0 8px 25px rgba(0,0,0,0.06);
                }

                .student-events h2 {
                    margin-top: 0;

                    color: #2563eb;

                    font-size: 25px;
                }

                .student-events-subtitle {
                    color: #555;

                    margin-bottom: 25px;
                }

                .events-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(3, 1fr);

                    gap: 20px;
                }

                .event-card {
                    background: #f8fbff;

                    border: 1px solid #dbeafe;

                    border-radius: 15px;

                    padding: 20px;

                    transition: 0.2s;
                }

                .event-card:hover {
                    transform: translateY(-3px);

                    box-shadow:
                        0 8px 20px rgba(37,99,235,0.12);
                }

                .event-icon {
                    font-size: 35px;

                    margin-bottom: 12px;
                }

                .event-card h3 {
                    color: #2563eb;

                    margin: 8px 0;
                }

                .event-card p {
                    color: #555;

                    line-height: 1.5;
                }

                .event-info {
                    color: #666;

                    font-size: 14px;

                    margin: 15px 0;

                    display: flex;

                    flex-direction: column;

                    gap: 7px;
                }

                .book-button {
                    border: none;

                    background: #3b82f6;

                    color: white;

                    padding: 12px 20px;

                    border-radius: 9px;

                    cursor: pointer;

                    font-weight: 600;

                    font-size: 15px;

                    width: 100%;
                }

                .book-button:hover {
                    background: #2563eb;
                }

                /* ================= PROFILE ================= */

                .student-profile {
                    background: white;

                    border-radius: 18px;

                    padding: 30px;

                    margin-top: 30px;

                    box-shadow:
                        0 8px 25px rgba(0,0,0,0.06);
                }

                .student-profile h2 {
                    margin-top: 0;

                    color: #2563eb;
                }

                .profile-grid {
                    display: grid;

                    grid-template-columns:
                        repeat(3, 1fr);

                    gap: 20px;
                }

                .profile-card {
                    background: #f8fbff;

                    border: 1px solid #dbeafe;

                    border-radius: 12px;

                    padding: 18px;
                }

                .profile-card span {
                    display: block;

                    color: #777;

                    font-size: 13px;

                    margin-bottom: 8px;
                }

                .profile-card strong {
                    color: #333;

                    font-size: 16px;
                }

                /* ================= LOADING ================= */

                .student-loading {
                    text-align: center;

                    padding: 30px;

                    color: #2563eb;

                    font-size: 18px;
                }

                .student-error {
                    background: #fee2e2;

                    color: #dc2626;

                    padding: 15px;

                    border-radius: 10px;

                    margin-top: 25px;
                }

                /* ================= FOOTER ================= */

                .student-footer {
                    text-align: center;

                    color: #777;

                    margin-top: 35px;

                    padding: 20px;
                }

                /* ================= RESPONSIVE ================= */

                @media (max-width: 1000px) {

                    .student-stats {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .events-grid {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .profile-grid {
                        grid-template-columns:
                            1fr;
                    }
                }

                @media (max-width: 700px) {

                    .student-sidebar {
                        width: 100%;

                        height: auto;

                        min-height: auto;

                        position: relative;
                    }

                    .student-page {
                        display: block;
                    }

                    .student-content {
                        margin-left: 0;

                        width: 100%;

                        padding: 25px;
                    }

                    .student-stats,
                    .events-grid {
                        grid-template-columns: 1fr;
                    }
                }

            `}</style>

            <div className="student-page">

                {/* SIDEBAR */}

                <aside className="student-sidebar">

                    <div className="student-logo-circle">
                        🎓
                    </div>

                    <div className="student-logo-title">
                        BDE Events
                    </div>

                    <div className="student-menu">

                        <button
                            className="active"
                            onClick={() =>
                                navigate("/student/dashboard")
                            }
                        >
                            🏠 Dashboard
                        </button>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("events")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            📅 Événements
                        </button>

                        <button
                            onClick={() =>
                                navigate("/tickets")
                            }
                        >
                            🎟️ Mes tickets
                        </button>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("profile")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
                            👤 Mon profil
                        </button>

                    </div>

                    <button
                        className="student-logout"
                        onClick={logout}
                    >
                        Déconnexion
                    </button>

                </aside>

                {/* CONTENT */}

                <main className="student-content">

                    {/* WELCOME */}

                    <div className="student-welcome">

                        <h1>
                            Bonjour {user.name} 👋
                        </h1>

                        <p>
                            Découvrez les événements de votre campus,
                            réservez votre place et profitez pleinement
                            de chaque expérience.
                        </p>

                    </div>

                    {/* STATS */}

                    <div className="student-stats">

                        <div className="student-stat-card">

                            <div className="student-stat-icon">
                                📅
                            </div>

                            <h3>
                                Événements disponibles
                            </h3>

                            <p className="student-stat-number">
                                {events.length}
                            </p>

                        </div>

                        <div className="student-stat-card">

                            <div className="student-stat-icon">
                                🎟️
                            </div>

                            <h3>
                                Mes tickets
                            </h3>

                            <p className="student-stat-number">
                                0
                            </p>

                        </div>

                        <div className="student-stat-card">

                            <div className="student-stat-icon">
                                ⭐
                            </div>

                            <h3>
                                Mes réservations
                            </h3>

                            <p className="student-stat-number">
                                0
                            </p>

                        </div>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="student-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* EVENTS */}

                    <section
                        className="student-events"
                        id="events"
                    >

                        <h2>
                            📅 Événements du campus
                        </h2>

                        <p className="student-events-subtitle">
                            Consultez les événements disponibles
                            et réservez votre place.
                        </p>

                        {loading ? (

                            <div className="student-loading">
                                Chargement des événements...
                            </div>

                        ) : events.length === 0 ? (

                            <div className="student-loading">
                                📅
                                <br />
                                <br />
                                Aucun événement disponible
                            </div>

                        ) : (

                            <div className="events-grid">

                                {events.map((event) => (

                                    <div
                                        className="event-card"
                                        key={event.id}
                                    >

                                        <div className="event-icon">
                                            📅
                                        </div>

                                        <h3>
                                            {event.title}
                                        </h3>

                                        <p>
                                            {event.description ||
                                                "Découvrez cet événement organisé par le BDE."}
                                        </p>

                                        <div className="event-info">

                                            <span>
                                                📅{" "}
                                                {event.date ||
                                                    event.event_date ||
                                                    "Date à venir"}
                                            </span>

                                            <span>
                                                📍{" "}
                                                {event.location ||
                                                    "Campus"}
                                            </span>

                                        </div>

                                        <button
                                            className="book-button"
                                            onClick={() =>
                                                bookEvent(event.id)
                                            }
                                        >
                                            Réserver ma place
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </section>

                    {/* PROFILE */}

                    <section
                        className="student-profile"
                        id="profile"
                    >

                        <h2>
                            👤 Mes informations
                        </h2>

                        <p>
                            Informations de votre compte étudiant
                        </p>

                        <div className="profile-grid">

                            <div className="profile-card">

                                <span>
                                    Nom
                                </span>

                                <strong>
                                    {user.name || "-"}
                                </strong>

                            </div>

                            <div className="profile-card">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user.email || "-"}
                                </strong>

                            </div>

                            <div className="profile-card">

                                <span>
                                    Rôle
                                </span>

                                <strong>
                                    Étudiant
                                </strong>

                            </div>

                        </div>

                    </section>

                    {/* FOOTER */}

                    <footer className="student-footer">
                        © 2026 BDE-Events — Campus • Events • Experience
                    </footer>

                </main>

            </div>
        </>
    );
}

export default StudentDashboard;
