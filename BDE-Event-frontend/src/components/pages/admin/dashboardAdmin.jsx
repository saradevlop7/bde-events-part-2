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

    // Form state (Zdt fih time)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "10:00", // Default time
        location: "",
        price: 0,
        max_capacity: 0,
    });

    const user = JSON.parse(localStorage.getItem("user")) || {
        name: "Admin",
    };

    // Fetch Data
    const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const [statsRes, eventsRes] = await Promise.all([
                api.get("/admin/events/stats", { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
                api.get("/events", { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
            ]);

            if (statsRes?.data) {
                setStats({
                    events: statsRes.data.events || 0,
                    students: statsRes.data.students || 0,
                    bookings: statsRes.data.bookings || 0,
                    tickets: statsRes.data.tickets || 0,
                });
            }

            if (eventsRes?.data) {
                const list = Array.isArray(eventsRes.data) ? eventsRes.data : eventsRes.data.events || [];
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
    }, [navigate]);

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Open Form to Add
    const openAddForm = () => {
        setEditingId(null);
        setFormData({
            title: "",
            description: "",
            date: "",
            time: "10:00",
            location: "",
            price: 0,
            max_capacity: 0
        });
        setShowForm(true);
    };

    // Open Form to Edit
    const handleEdit = (eventItem) => {
        setEditingId(eventItem.id);

        let formattedDate = "";
        if (eventItem.date || eventItem.event_date) {
            const rawDate = eventItem.date || eventItem.event_date;
            formattedDate = new Date(rawDate).toISOString().split('T')[0];
        }

        setFormData({
            title: eventItem.title || "",
            description: eventItem.description || "",
            date: formattedDate,
            time: eventItem.time || eventItem.event_time || "10:00",
            location: eventItem.location || "",
            price: eventItem.price || 0,
            max_capacity: eventItem.max_capacity || eventItem.capacity || 0,
        });
        setShowForm(true);
        window.scrollTo({ top: 400, behavior: "smooth" });
    };

    // Submit Form (Create OR Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        // Payload kayhze klllshi yqder y-requirih backend
        const payload = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            event_date: formData.date,
            time: formData.time,          // REQUIRED BY BACKEND
            event_time: formData.time,    // Double safety
            location: formData.location,
            price: Number(formData.price),
            max_capacity: Number(formData.max_capacity),
            capacity: Number(formData.max_capacity)
        };

        try {
            if (editingId) {
                // MODIFIER (PUT)
                await api.put(`/events/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("🎉 Événement modifié avec succès !");
            } else {
                // AJOUTER (POST)
                await api.post("/events", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("🎉 Événement créé avec succès !");
            }

            setShowForm(false);
            setEditingId(null);
            fetchData(); // Refresh list & stats
        } catch (error) {
            console.error("Erreur lors de l'enregistrement:", error.response?.data || error.message);
            const errDetail = error.response?.data?.message || JSON.stringify(error.response?.data) || "Une erreur s'est produite";
            alert("❌ Erreur: " + errDetail);
        }
    };

    // Delete Event
    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;

        const token = localStorage.getItem("token");
        try {
            await api.delete(`/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("🗑️ Événement supprimé !");
            fetchData();
        } catch (error) {
            console.error("Erreur suppression:", error);
            alert("Erreur lors de la suppression.");
        }
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

                .form-container {
                    background: white;
                    border-radius: 18px;
                    padding: 25px;
                    margin-top: 30px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    color: #444;
                    font-weight: 600;
                }

                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }

                .table-container {
                    background: white;
                    border-radius: 18px;
                    padding: 25px;
                    margin-top: 30px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }

                .btn-edit {
                    background: #f59e0b;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-right: 5px;
                }

                .btn-delete {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
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
                    <div className="logo-circle">🎓</div>
                    <div className="logo-title">BDE Events</div>

                    <div className="admin-menu">
                        <button onClick={() => navigate("/admin/dashboard")}>
                            🏠 Dashboard
                        </button>
                        <button onClick={openAddForm}>
                            ➕ Ajouter événement
                        </button>
                        <button onClick={() => document.getElementById("events-table")?.scrollIntoView({ behavior: "smooth" })}>
                            📅 Événements
                        </button>
                        <button>
                            🎟️ Réservations
                        </button>
                    </div>

                    <button className="logout-button" onClick={logout}>
                        Déconnexion
                    </button>
                </aside>

                <main className="admin-content">
                    <div className="welcome-card">
                        <h1>Bonjour {user.name} 👋</h1>
                        <p>Gérez les événements et les réservations depuis votre espace administrateur.</p>
                    </div>

                    {loading ? (
                        <div className="loading">Chargement des données...</div>
                    ) : (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <h3>Événements</h3>
                                <p className="stat-number">{stats.events}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <h3>Étudiants</h3>
                                <p className="stat-number">{stats.students}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎟️</div>
                                <h3>Réservations</h3>
                                <p className="stat-number">{stats.bookings}</p>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎫</div>
                                <h3>Tickets</h3>
                                <p className="stat-number">{stats.tickets}</p>
                            </div>
                        </div>
                    )}

                    <div className="actions">
                        <div className="action-card">
                            <h2>📅 Événements</h2>
                            <p>Consultez et gérez les événements du BDE.</p>
                            <button onClick={() => document.getElementById("events-table")?.scrollIntoView({ behavior: "smooth" })}>
                                Gérer les événements
                            </button>
                        </div>

                        <div className="action-card">
                            <h2>➕ Nouveau événement</h2>
                            <p>Ajoutez un nouvel événement pour les étudiants.</p>
                            <button onClick={openAddForm}>
                                Ajouter événement
                            </button>
                        </div>
                    </div>

                    {/* FORMULAIRE (Ajout/Modification) */}
                    {showForm && (
                        <div className="form-container">
                            <h2>{editingId ? "✏️ Modifier l'événement" : "➕ Ajouter un événement"}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Titre</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Lieu</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Heure</label>
                                        <input type="time" name="time" value={formData.time} onChange={handleInputChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Prix (DH)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Capacité Max</label>
                                    <input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3"></textarea>
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button type="submit" style={{ background: "#2563eb", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                                        {editingId ? "Enregistrer les modifications" : "Créer l'événement"}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} style={{ background: "#6b7280", color: "white", padding: "10px 20px", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TABLEAU DES ÉVÉNEMENTS */}
                    <div className="table-container" id="events-table">
                        <h2>📋 Liste des événements</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Date & Heure</th>
                                    <th>Lieu</th>
                                    <th>Prix</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventsList && eventsList.length > 0 ? (
                                    eventsList.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.title}</td>
                                            <td>{item.date || item.event_date} {item.time ? `à ${item.time}` : ''}</td>
                                            <td>{item.location}</td>
                                            <td>{item.price ? `${item.price} DH` : "Gratuit"}</td>
                                            <td>
                                                <button className="btn-edit" onClick={() => handleEdit(item)}>✏️</button>
                                                <button className="btn-delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>Aucun événement trouvé</td>
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
