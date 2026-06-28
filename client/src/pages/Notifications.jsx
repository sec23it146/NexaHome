import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const load = () => api.get("/notifications").then(({ data }) => setNotifications(data));
  useEffect(() => { load(); }, []);

  const read = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="page-stack">
      <div className="page-title"><h2>Notifications</h2><p>Device status, security, sensor, and system alerts.</p></div>
      <section className="notification-list">
        {notifications.map((note) => (
          <article className={`notification ${note.severity} ${note.read ? "read" : ""}`} key={note._id}>
            <div><strong>{note.title}</strong><p>{note.message}</p><small>{note.type} · {new Date(note.createdAt).toLocaleString()}</small></div>
            {!note.read && <button className="icon-btn" onClick={() => read(note._id)} title="Mark read"><CheckCircle size={18} /></button>}
          </article>
        ))}
        {!notifications.length && <EmptyState title="No notifications" />}
      </section>
    </div>
  );
};

export default Notifications;
