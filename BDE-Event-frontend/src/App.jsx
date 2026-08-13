import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import DashboardAdmin from "./components/pages/admin/dashboardAdmin";
import StudentDashboard from "./components/pages/student/dashboardstudent";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route
                    path="/admin/dashboard"
                    element={<DashboardAdmin />}
                />

                <Route
                    path="/dashboard"
                    element={<StudentDashboard />}
                />

                <Route
                    path="/admin/events"
                    element={<h1>Gestion des événements</h1>}
                />

                <Route
                    path="/admin/bookings"
                    element={<h1>Gestion des réservations</h1>}
                />

                <Route
                    path="/admin/tickets"
                    element={<h1>Gestion des tickets</h1>}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
