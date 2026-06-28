import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import api from "../services/api.js";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  const load = () => api.get("/activity-logs", { params: { search } }).then(({ data }) => setLogs(data));
  useEffect(() => { load(); }, []);

  const exportCsv = () => {
    api.get("/activity-logs/export", { responseType: "blob" }).then(({ data }) => {
      const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "activity-logs.csv";
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="page-stack">
      <div className="page-actions">
        <div className="page-title"><h2>Activity Logs</h2><p>Every device action and user activity with timestamps.</p></div>
        <button className="primary-btn" onClick={exportCsv}><Download size={18} /> Export CSV</button>
      </div>
      <div className="filters">
        <label className="search-box"><Search size={18} /><input placeholder="Search logs" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && load()} /></label>
      </div>
      <section className="table-panel">
        <table>
          <thead><tr><th>Time</th><th>Action</th><th>Description</th><th>User</th><th>Device</th></tr></thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.action}</td>
                <td>{log.description}</td>
                <td>{log.user?.name || "System"}</td>
                <td>{log.device?.name || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!logs.length && <EmptyState title="No activity logs" />}
      </section>
    </div>
  );
};

export default ActivityLogs;
