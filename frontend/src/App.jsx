import { useState } from "react";
import "./App.css";

function App() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        price: "",
        capacity: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});
        setSuccess("");

        // Pour le moment, test frontend uniquement
        console.log(formData);

        setSuccess("Événement prêt à être envoyé à l'API !");
    };

    return (
        <div className="page">

            <div className="event-container">

                <h1>➕ Créer un événement</h1>

                {Object.keys(errors).length > 0 && (
                    <div className="error-box">
                        <ul>
                            {Object.values(errors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {success && (
                    <div className="success-box">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Titre */}
                    <div className="form-group">
                        <label>Titre</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        />
                    </div>

                    {/* Date + Heure */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>Date</label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Heure</label>

                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    {/* Lieu */}
                    <div className="form-group">
                        <label>Lieu</label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Prix + Capacité */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>Prix</label>

                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Capacité</label>

                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <button type="submit">
                        Enregistrer
                    </button>

                </form>

            </div>
        </div>
    );
}

export default App;
