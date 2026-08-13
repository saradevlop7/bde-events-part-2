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

    const [eventsList, setEventsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "10:00",
        location: "",
        price: 0,
        max_capacity: 0,
    });

    const user =
        JSON.parse(localStorage.getItem("user")) || {
            name: "Admin",
        };

    // =========================
    // LOGOUT
    // =========================
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // =========================
    // FETCH DATA
    // =========================
    const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const [statsRes, eventsRes] = await Promise.all([
                api
                    .get("/admin/events/stats", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .catch(() => null),

                api
                    .get("/events", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .catch(() => null),
            ]);

            // Stats
            if (statsRes?.data) {
                setStats({
                    events: statsRes.data.events || 0,
                    students: statsRes.data.students || 0,
                    bookings: statsRes.data.bookings || 0,
                    tickets: statsRes.data.tickets || 0,
                });
            }

            // Events
            if (eventsRes?.data) {
                const list = Array.isArray(eventsRes.data)
                    ? eventsRes.data
                    : eventsRes.data.events ||
                      eventsRes.data.data ||
                      [];

                setEventsList(list);
            }
        } catch (error) {
            console.error("Erreur API:", error);

            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // =========================
    // INPUT CHANGE
    // =========================
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // AJOUTER
    // =========================
    const openAddForm = () => {
        setEditingId(null);

        setFormData({
            title: "",
            description: "",
            date: "",
            time: "10:00",
            location: "",
            price: 0,
            max_capacity: 0,
        });

        setShowForm(true);

        setTimeout(() => {
            window.scrollTo({
                top: 450,
                behavior: "smooth",
            });
        }, 100);
    };

    // =========================
    // MODIFIER
    // =========================
    const handleEdit = (eventItem) => {
        setEditingId(eventItem.id);

        const rawDate =
            eventItem.date ||
            eventItem.event_date ||
            "";

        let formattedDate = "";

        if (rawDate) {
            formattedDate = rawDate.includes("T")
                ? rawDate.split("T")[0]
                : rawDate.split(" ")[0];
        }

        setFormData({
            title: eventItem.title || "",
            description: eventItem.description || "",
            date: formattedDate,
            time:
                eventItem.time ||
                eventItem.event_time ||
                "10:00",
            location: eventItem.location || "",
            price: eventItem.price ?? 0,
            max_capacity:
                eventItem.max_capacity ??
                eventItem.capacity ??
                0,
        });

        setShowForm(true);

        setTimeout(() => {
            window.scrollTo({
                top: 450,
                behavior: "smooth",
            });
        }, 100);
    };

    // =========================
    // SUBMIT
    // AJOUT OU MODIFICATION
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            event_date: formData.date,
            time: formData.time,
            event_time: formData.time,
            location: formData.location,
            price: Number(formData.price),
            max_capacity: Number(
                formData.max_capacity
            ),
            capacity: Number(
                formData.max_capacity
            ),
        };

        try {
            // =========================
            // MODIFICATION
            // =========================
            if (editingId) {
                await api.put(
                    `/events/${editingId}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert(
                    "✅ Événement modifié avec succès !"
                );
            }

            // =========================
            // AJOUT
            // =========================
            else {
                await api.post(
                    "/events",
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert(
                    "✅ Événement créé avec succès !"
                );
            }

            // Reset
            setShowForm(false);
            setEditingId(null);

            setFormData({
                title: "",
                description: "",
                date: "",
                time: "10:00",
                location: "",
                price: 0,
                max_capacity: 0,
            });

            // Refresh
            await fetchData();
        } catch (error) {
            console.error(
                "Erreur:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "❌ Une erreur est survenue."
            );
        }
    };

    // =========================
    // SUPPRIMER
    // =========================
    const handleDelete = async (id) => {
        const confirmation = window.confirm(
            "Êtes-vous sûr de vouloir supprimer cet événement ?"
        );

        if (!confirmation) return;

        const token = localStorage.getItem("token");

        try {
            await api.delete(
                `/events/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert(
                "🗑️ Événement supprimé avec succès !"
            );

            await fetchData();
        } catch (error) {
            console.error(
                "Erreur suppression:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                    "❌ Erreur lors de la suppression."
            );
        }
    };

    // =========================
    // CANCEL FORM
    // =========================
    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);

        setFormData({
            title: "",
            description: "",
            date: "",
            time: "10:00",
            location: "",
            price: 0,
            max_capacity: 0,
        });
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

                /* SIDEBAR */
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

                /* CONTENT */
                .admin-content {
                    margin-left: 250px;
                    width: calc(100% - 250px);
                    padding: 50px;
                }

                /* WELCOME */
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

                /* STATS */
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

                /* ACTIONS */
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

                .action-card p {
                    color: #555;
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

                /* FORM */
                .form-container {
                    background: white;
                    border-radius: 18px;
                    padding: 30px;
                    margin-top: 30px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                }

                .form-container h2 {
                    color: #2563eb;
                    margin-top: 0;
                    margin-bottom: 25px;
                }

                .form-group {
                    margin-bottom: 18px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 7px;
                    color: #444;
                    font-weight: 600;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 15px;
                    outline: none;
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
                }

                .form-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 25px;
                }

                .btn-submit {
                    background: #2563eb;
                    color: white;
                    padding: 12px 22px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .btn-submit:hover {
                    background: #1d4ed8;
                }

                .btn-cancel {
                    background: #6b7280;
                    color: white;
                    padding: 12px 22px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                }

                .btn-cancel:hover {
                    background: #4b5563;
                }

                /* TABLE */
                .table-container {
                    background: white;
                    border-radius: 18px;
                    padding: 25px;
                    margin-top: 30px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                    overflow-x: auto;
                }

                .table-container h2 {
                    color: #2563eb;
                    margin-top: 0;
                    margin-bottom: 20px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th {
                    background: #eff6ff;
                    color: #2563eb;
                    font-weight: 700;
                }

                th,
                td {
                    padding: 14px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }

                td {
                    color: #555;
                }

                tr:hover {
                    background: #f8fafc;
                }

                .btn-edit {
                    background: #f59e0b;
                    color: white;
                    border: none;
                    padding: 7px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-right: 6px;
                }

                .btn-edit:hover {
                    background: #d97706;
                }

                .btn-delete {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 7px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .btn-delete:hover {
                    background: #dc2626;
                }

                .loading {
                    text-align: center;
                    padding: 30px;
                    color: #2563eb;
                    font-size: 18px;
                }

                /* RESPONSIVE */
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

                {/* ================= SIDEBAR ================= */}
                <aside className="admin-sidebar">

                    <div className="logo-circle">
                        🎓
                    </div>

                    <div className="logo-title">
                        BDE Events
                    </div>

                    <div className="admin-menu">

                        <button
                            onClick={() =>
                                navigate("/admin/dashboard")
                            }
                        >
                            🏠 Dashboard
                        </button>

                        <button
                            onClick={openAddForm}
                        >
                            ➕ Ajouter événement
                        </button>

                        <button
                            onClick={() =>
                                document
                                    .getElementById(
                                        "events-table"
                                    )
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                        >
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

                {/* ================= MAIN ================= */}
                <main className="admin-content">

                    {/* WELCOME */}
                    <div className="welcome-card">

                        <h1>
                            Bonjour {user.name} 👋
                        </h1>

                        <p>
                            Gérez les événements et les
                            réservations depuis votre espace
                            administrateur.
                        </p>

                    </div>

                    {/* STATS */}
                    {loading ? (
                        <div className="loading">
                            Chargement des données...
                        </div>
                    ) : (
                        <div className="stats-grid">

                            <div className="stat-card">
                                <div className="stat-icon">
                                    📅
                                </div>

                                <h3>
                                    Événements
                                </h3>

                                <p className="stat-number">
                                    {stats.events}
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    👥
                                </div>

                                <h3>
                                    Étudiants
                                </h3>

                                <p className="stat-number">
                                    {stats.students}
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    🎟️
                                </div>

                                <h3>
                                    Réservations
                                </h3>

                                <p className="stat-number">
                                    {stats.bookings}
                                </p>
                            </div>

                            <div className="stat-card">
                                <div className="stat-icon">
                                    🎫
                                </div>

                                <h3>
                                    Tickets
                                </h3>

                                <p className="stat-number">
                                    {stats.tickets}
                                </p>
                            </div>

                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="actions">

                        <div className="action-card">

                            <h2>
                                📅 Événements
                            </h2>

                            <p>
                                Consultez et gérez les
                                événements du BDE.
                            </p>

                            <button
                                onClick={() =>
                                    document
                                        .getElementById(
                                            "events-table"
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        })
                                }
                            >
                                Gérer les événements
                            </button>

                        </div>

                        <div className="action-card">

                            <h2>
                                ➕ Nouveau événement
                            </h2>

                            <p>
                                Ajoutez un nouvel événement
                                pour les étudiants.
                            </p>

                            <button
                                onClick={openAddForm}
                            >
                                Ajouter événement
                            </button>

                        </div>

                    </div>

                    {/* ================= FORM ================= */}
                    {showForm && (
                        <div className="form-container">

                            <h2>
                                {editingId
                                    ? "✏️ Modifier l'événement"
                                    : "➕ Ajouter un événement"}
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                            >

                                <div className="form-group">

                                    <label>
                                        Titre
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={
                                            formData.title
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Lieu
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1fr 1fr",
                                        gap: "15px",
                                    }}
                                >

                                    <div className="form-group">

                                        <label>
                                            Date
                                        </label>

                                        <input
                                            type="date"
                                            name="date"
                                            value={
                                                formData.date
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    <div className="form-group">

                                        <label>
                                            Heure
                                        </label>

                                        <input
                                            type="time"
                                            name="time"
                                            value={
                                                formData.time
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Prix (DH)
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        min="0"
                                        value={
                                            formData.price
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Capacité maximale
                                    </label>

                                    <input
                                        type="number"
                                        name="max_capacity"
                                        min="0"
                                        value={
                                            formData.max_capacity
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            formData.description
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        rows="4"
                                    />

                                </div>

                                <div className="form-buttons">

                                    <button
                                        type="submit"
                                        className="btn-submit"
                                    >
                                        {editingId
                                            ? "💾 Enregistrer les modifications"
                                            : "➕ Créer l'événement"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={closeForm}
                                    >
                                        Annuler
                                    </button>

                                </div>

                            </form>

                        </div>
                    )}

                    {/* ================= EVENTS TABLE ================= */}
                    <div
                        className="table-container"
                        id="events-table"
                    >

                        <h2>
                            📋 Liste des événements
                        </h2>

                        <table>

                            <thead>

                                <tr>
                                    <th>
                                        Titre
                                    </th>

                                    <th>
                                        Date & Heure
                                    </th>

                                    <th>
                                        Lieu
                                    </th>

                                    <th>
                                        Prix
                                    </th>

                                    <th>
                                        Capacité
                                    </th>

                                    <th>
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {eventsList.length > 0 ? (

                                    eventsList.map(
                                        (item) => (
                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        item.title
                                                    }
                                                </td>

                                                <td>
                                                    {item.date ||
                                                        item.event_date ||
                                                        "-"}{" "}
                                                    {item.time ||
                                                    item.event_time
                                                        ? `à ${
                                                              item.time ||
                                                              item.event_time
                                                          }`
                                                        : ""}
                                                </td>

                                                <td>
                                                    {
                                                        item.location
                                                    }
                                                </td>

                                                <td>
                                                    {item.price &&
                                                    Number(
                                                        item.price
                                                    ) > 0
                                                        ? `${item.price} DH`
                                                        : "Gratuit"}
                                                </td>

                                                <td>
                                                    {item.max_capacity ||
                                                        item.capacity ||
                                                        "-"}
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn-edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        className="btn-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        🗑️
                                                    </button>

                                                </td>

                                            </tr>
                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding:
                                                    "25px",
                                            }}
                                        >
                                            Aucun événement
                                            trouvé
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </main>

            </div>
        </>
    );
}

export default DashboardAdmin;
