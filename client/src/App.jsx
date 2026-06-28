import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ActivityLogs from "./pages/ActivityLogs.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Automations from "./pages/Automations.jsx";
import Devices from "./pages/Devices.jsx";
import GuestDashboard from "./pages/GuestDashboard.jsx";
import HomeownerDashboard from "./pages/HomeownerDashboard.jsx";
import Login from "./pages/Login.jsx";
import Notifications from "./pages/Notifications.jsx";
import PremiumInfoPage from "./pages/PremiumInfoPage.jsx";
import Register from "./pages/Register.jsx";
import Users from "./pages/Users.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const RoleHome = () => {
  const { user } = useAuth();
  if (user?.role === "Admin") return <AdminDashboard />;
  if (user?.role === "Guest") return <GuestDashboard />;
  return <HomeownerDashboard />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<RoleHome />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/rooms" element={<PremiumInfoPage type="rooms" />} />
          <Route path="/security" element={<PremiumInfoPage type="security" />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reports" element={<PremiumInfoPage type="reports" />} />
          <Route path="/activity" element={<ActivityLogs />} />
          <Route path="/settings" element={<PremiumInfoPage type="settings" />} />
          <Route element={<ProtectedRoute roles={["Admin"]} />}>
            <Route path="/users" element={<Users />} />
          </Route>
          <Route element={<ProtectedRoute roles={["Admin", "Homeowner"]} />}>
            <Route path="/automations" element={<Automations />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
