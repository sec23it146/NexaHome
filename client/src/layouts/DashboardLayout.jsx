import {
  BarChart3,
  Bell,
  ClipboardList,
  Home,
  Layers3,
  LogOut,
  Menu,
  Moon,
  Network,
  Settings,
  Settings2,
  ShieldCheck,
  Sun,
  Users,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import nexaLogo from "../assets/nexahome-logo.png";

const links = [
  { to: "/", label: "Dashboard", icon: Home, roles: ["Admin", "Homeowner", "Guest"] },
  { to: "/devices", label: "Devices", icon: Network, roles: ["Admin", "Homeowner", "Guest"] },
  { to: "/rooms", label: "Rooms", icon: Layers3, roles: ["Admin", "Homeowner", "Guest"] },
  { to: "/automations", label: "Automation Rules", icon: Settings2, roles: ["Admin", "Homeowner"] },
  { to: "/security", label: "Security", icon: ShieldCheck, roles: ["Admin", "Homeowner", "Guest"] },
  { to: "/notifications", label: "Notifications", icon: Bell, roles: ["Admin", "Homeowner", "Guest"] },
  { to: "/reports", label: "Reports", icon: BarChart3, roles: ["Admin", "Homeowner", "Guest"] },
  { to: "/activity", label: "Activity Logs", icon: ClipboardList, roles: ["Admin", "Homeowner", "Guest"] },
  { to: "/users", label: "User Management", icon: Users, roles: ["Admin"] },
  { to: "/settings", label: "Settings", icon: Settings, roles: ["Admin", "Homeowner", "Guest"] }
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");
    socket.emit("join", user?._id);
    socket.on("notification", (notification) => setToast(notification.message));
    socket.on("notification:new", (notification) => setToast(notification.message));
    return () => socket.disconnect();
  }, [user?._id]);

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <motion.aside className={`sidebar ${open ? "show" : ""}`} initial={{ x: -28, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
        <div className="brand">
          <img src={nexaLogo} alt="NexaHome logo" />
          <div>
            <strong>NexaHome</strong>
            <small>Control Center</small>
          </div>
        </div>
        <nav>
          {links.filter((link) => link.roles.includes(user?.role)).map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
      <main className="main-panel">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen((value) => !value)} title="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h1>{user?.role} Workspace</h1>
            <p>{user?.name} - {user?.email}</p>
          </div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              <span>{theme === "light" ? "Dark" : "Light"}</span>
            </button>
            <button className="icon-btn" onClick={doLogout} title="Logout"><LogOut size={18} /></button>
          </div>
        </header>
        {toast && (
          <motion.button className="toast" onClick={() => setToast("")} title="Dismiss notification" initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            {toast}
          </motion.button>
        )}
        <motion.section className="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Outlet />
        </motion.section>
      </main>
    </div>
  );
};

export default DashboardLayout;
