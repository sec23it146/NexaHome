import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const blank = { name: "", category: "Smart Light", location: "", status: "OFF", isActive: false, sensorValue: "", sensorUnit: "", assignedTo: [] };

const Devices = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);

  const load = async () => {
    const { data } = await api.get("/devices", { params: filters });
    setDevices(data);
    if (user.role === "Admin") {
      const { data: userData } = await api.get("/users");
      setUsers(userData);
    }
  };
  useEffect(() => { load(); }, [filters.category]);

  const openForm = (device = null) => {
    setEditing(device);
    setForm(device ? { ...device, assignedTo: device.assignedTo?.map((u) => u._id || u) || [] } : blank);
    setFormOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();
    const payload = { ...form, sensorValue: form.sensorValue === "" ? null : Number(form.sensorValue) };
    if (editing) await api.put(`/devices/${editing._id}`, payload);
    else await api.post("/devices", payload);
    setFormOpen(false);
    load();
  };

  const toggle = async (id) => { await api.patch(`/devices/${id}/toggle`); load(); };
  const remove = async (id) => { if (confirm("Delete this device?")) { await api.delete(`/devices/${id}`); load(); } };

  return (
    <div className="page-stack">
      <div className="page-actions">
        <div className="page-title"><h2>Device Management</h2><p>Search, view, and control assigned smart devices.</p></div>
        {user.role === "Admin" && <button className="primary-btn" onClick={() => openForm()}><Plus size={18} /> Add Device</button>}
      </div>
      <div className="filters">
        <label className="search-box"><Search size={18} /><input placeholder="Search devices" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} onKeyDown={(e) => e.key === "Enter" && load()} /></label>
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All categories</option><option>Smart Light</option><option>Fan</option><option>Door Lock</option><option>Sensor</option>
        </select>
      </div>
      <section className="device-grid">
        {devices.map((device) => (
          <div className="device-wrap" key={device._id}>
            <DeviceCard device={device} onToggle={toggle} />
            {user.role === "Admin" && <div className="card-actions"><button className="icon-btn" onClick={() => openForm(device)} title="Edit"><Edit size={16} /></button><button className="icon-btn danger" onClick={() => remove(device._id)} title="Delete"><Trash2 size={16} /></button></div>}
          </div>
        ))}
      </section>
      {!devices.length && <EmptyState title="No devices found" />}
      {formOpen && (
        <Modal title={editing ? "Edit Device" : "Add Device"} onClose={() => setFormOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></label>
            <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Smart Light</option><option>Fan</option><option>Door Lock</option><option>Sensor</option></select></label>
            <label>Status<select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>ON</option><option>OFF</option><option>LOCKED</option><option>UNLOCKED</option><option>ALERT</option></select></label>
            <label>Sensor Value<input type="number" value={form.sensorValue ?? ""} onChange={(e) => setForm({ ...form, sensorValue: e.target.value })} /></label>
            <label>Sensor Unit<input value={form.sensorUnit || ""} onChange={(e) => setForm({ ...form, sensorUnit: e.target.value })} /></label>
            {user.role === "Admin" && (
              <div className="full field-group">
                <span>Assigned Users</span>
                <div className="check-grid">
                  {users.map((assignedUser) => {
                    const selected = form.assignedTo.includes(assignedUser._id);
                    return (
                      <label className="check-row" key={assignedUser._id}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const nextUsers = e.target.checked
                              ? [...form.assignedTo, assignedUser._id]
                              : form.assignedTo.filter((id) => id !== assignedUser._id);
                            setForm({ ...form, assignedTo: nextUsers });
                          }}
                        />
                        <span>{assignedUser.name}</span>
                        <small>{assignedUser.role} · {assignedUser.email}</small>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            <button className="primary-btn full" type="submit">Save Device</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Devices;
