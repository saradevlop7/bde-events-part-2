import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function StudentDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (!token) {
            navigate("/login");
            return;
        }

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        loadEvents();
    }, [navigate]);

    const loadEvents = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/events", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setEvents(response.data.data || response.data || []);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger les événements.");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (eventId) => {
        setMessage("");
        setError("");
        setBookingId(eventId);

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

            setMessage("Réservation effectuée avec succès 🎉");

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Impossible d'effectuer la réservation."
            );
        } finally {
            setBookingId(null);
        }
    };

    // =========================
    // LOGOUT
    // =========================
    const handleLogout = () => {
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

                .student-logo {
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
                    gap: 14px;
                }

                .student-menu button {
                    border: none;
                    background: transparent;
                    color: white;
                    text-align: left;
                    padding: 13px 10px;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 10px;
                }

                .student-menu button:hover {
                    background: rgba(255,255,255,0.15);
                }

                .student-menu .active {
                    background: rgba(255,255,255,0.2);
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
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
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
                    font-size: 16px;
                }

                /* ================= STATS ================= */

                .student-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 22px;
                    margin-bottom: 30px;
                }

                .student-stat {
                    background: white;
                    padding: 25px;
                    border-radius: 18px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                    border-left: 5px solid #3b82f6;
                }

                .student-stat-icon {
                    font-size: 28px;
                    margin-bottom: 12px;
                }

                .student-stat h3 {
                    margin: 0 0 8px;
                    color: #444;
                    font-size: 16px;
                }

                .student-stat-number {
                    margin: 0;
                    color: #2563eb;
                    font-size: 34px;
                    font-weight: 700;
                }

                /* ================= MESSAGES ================= */

                .success-message {
                    background: #dcfce7;
                    color: #166534;
                    border: 1px solid #86efac;
                    padding: 15px 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                }

                .error-message {
                    background: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #fca5a5;
                    padding: 15px 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                }

                /* ================= EVENTS ================= */

                .events-section {
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                }

                .events-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 18px;
                }

                .events-header h2 {
                    margin: 0;
                    color: #2563eb;
                    font-size: 24px;
                }

                .events-count {
                    background: #dbeafe;
                    color: #2563eb;
                    padding: 7px 14px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                }

                .events-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 22px;
                }

                .event-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: 0.25s;
                }

                .event-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 25px rgba(37,99,235,0.12);
                    border-color: #93c5fd;
                }

                .event-image {
                    height: 140px;
                    background: linear-gradient(
                        135deg,
                        #2563eb,
                        #60a5fa
                    );
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 45px;
                }

                .event-body {
                    padding: 20px;
                }

                .event-badge {
                    display: inline-block;
                    background: #dbeafe;
                    color: #2563eb;
                    padding: 5px 9px;
                    border-radius: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .event-body h3 {
                    margin: 0 0 10px;
                    color: #1e293b;
                    font-size: 19px;
                }

                .event-description {
                    color: #64748b;
                    font-size: 13px;
                    line-height: 1.5;
                    min-height: 40px;
                }

                .event-info {
                    display: flex;
                    flex-direction: column;
                    gap: 7px;
                    margin: 15px 0;
                    color: #475569;
                    font-size: 12px;
                }

                .book-button {
                    width: 100%;
                    border: none;
                    background: #3b82f6;
                    color: white;
                    padding: 12px;
                    border-radius: 9px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: 0.2s;
                }

                .book-button:hover {
                    background: #2563eb;
                }

                .book-button:disabled {
                    background: #93c5fd;
                    cursor: not-allowed;
                }

                /* ================= EMPTY ================= */

                .empty-events {
                    text-align: center;
                    padding: 60px 20px;
                    color: #64748b;
                }

                .empty-events div {
                    font-size: 45px;
                    margin-bottom: 15px;
                }

                .empty-events h3 {
                    color: #334155;
                }

                /* ================= PROFILE ================= */

                .profile-section {
                    background: white;
                    margin-top: 30px;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                }

                .profile-section h2 {
                    color: #2563eb;
                    margin-top: 0;
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }

                .profile-card {
                    background: #eff6ff;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #dbeafe;
                }

                .profile-card span {
                    display: block;
                    color: #64748b;
                    font-size: 12px;
                    margin-bottom: 7px;
                }

                .profile-card strong {
                    color: #1e293b;
                }

                /* ================= RESPONSIVE ================= */

                @media (max-width: 1000px) {

                    .events-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .student-stats {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .profile-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 700px) {

                    .student-page {
                        display: block;
                    }

                    .student-sidebar {
                        position: relative;
                        width: 100%;
                        min-height: auto;
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

                    <div className="student-logo">
                        🎓
                    </div>

                    <div className="student-logo-title">
                        BDE Events
                    </div>

                    <div className="student-menu">

                        <button className="active">
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
                            onClick={() => navigate("/tickets")}
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
                        onClick={handleLogout}
                    >
                        Déconnexion
                    </button>

                </aside>

                {/* MAIN */}
                <main className="student-content">

                    {/* WELCOME */}
                    <div className="student-welcome">

                        <h1>
                            Bonjour {user?.name || "Étudiant"} 👋
                        </h1>

                        <p>
                            Découvrez les événements de votre campus,
                            réservez votre place et profitez pleinement
                            de chaque expérience.
                        </p>

                    </div>

                    {/* STATS */}
                    <div className="student-stats">

                        <div className="student-stat">
                            <div className="student-stat-icon">
                                📅
                            </div>

                            <h3>Événements</h3>

                            <p className="student-stat-number">
                                {events.length}
                            </p>
                        </div>

                        <div className="student-stat">
                            <div className="student-stat-icon">
                                🎟️
                            </div>

                            <h3>Mes tickets</h3>

                            <p className="student-stat-number">
                                0
                            </p>
                        </div>

                        <div className="student-stat">
                            <div className="student-stat-icon">
                                ⭐
                            </div>

                            <h3>Mes réservations</h3>

                            <p className="student-stat-number">
                                0
                            </p>
                        </div>

                    </div>

                    {/* MESSAGES */}
                    {message && (
                        <div className="success-message">
                            ✓ {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            ⚠ {error}
                        </div>
                    )}

                    {/* EVENTS */}
                    <section
                        id="events"
                        className="events-section"
                    >

                        <div className="events-header">

                            <h2>
                                📅 Événements du campus
                            </h2>

                            <span className="events-count">
                                {events.length} événements
                            </span>

                        </div>

                        {loading ? (

                            <div className="empty-events">
                                <div>⏳</div>
                                <p>
                                    Chargement des événements...
                                </p>
                            </div>

                        ) : events.length === 0 ? (

                            <div className="empty-events">

                                <div>📅</div>

                                <h3>
                                    Aucun événement disponible
                                </h3>

                                <p>
                                    Les prochains événements
                                    seront affichés ici.
                                </p>

                            </div>

                        ) : (

                            <div className="events-grid">

                                {events.map((event) => (

                                    <article
                                        className="event-card"
                                        key={event.id}
                                    >

                                        <div className="event-image">
                                            📅
                                        </div>

                                        <div className="event-body">

                                            <span className="event-badge">
                                                ÉVÉNEMENT
                                            </span>

                                            <h3>
                                                {event.title}
                                            </h3>

                                            <p className="event-description">
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
                                                disabled={
                                                    bookingId === event.id
                                                }
                                                onClick={() =>
                                                    handleBooking(event.id)
                                                }
                                            >
                                                {bookingId === event.id
                                                    ? "Réservation..."
                                                    : "Réserver ma place →"}
                                            </button>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}

                    </section>

                    {/* PROFILE */}
                    <section
                        id="profile"
                        className="profile-section"
                    >

                        <h2>
                            👤 Mes informations
                        </h2>

                        <div className="profile-grid">

                            <div className="profile-card">

                                <span>
                                    Nom
                                </span>

                                <strong>
                                    {user?.name || "-"}
                                </strong>

                            </div>

                            <div className="profile-card">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user?.email || "-"}
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

                </main>

            </div>
        </>
    );
}

export default StudentDashboard;
