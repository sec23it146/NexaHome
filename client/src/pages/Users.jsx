import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import api from "../services/api.js";

const blank = { name: "", email: "", phone: "", password: "", role: "Homeowner", isActive: true, accessibleDevices: [] };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "" });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);

  const load = async () => {
    const [{ data: userData }, { data: deviceData }] = await Promise.all([
      api.get("/users", { params: filters }),
      api.get("/devices")
    ]);
    setUsers(userData);
    setDevices(deviceData);
  };
  useEffect(() => { load(); }, [filters.role]);

  const openForm = (user = null) => {
    setEditing(user);
    setForm(user ? { ...user, password: "", accessibleDevices: user.accessibleDevices?.map((d) => d._id || d) || [] } : blank);
    setFormOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();
    if (editing) await api.put(`/users/${editing._id}`, form);
    else await api.post("/users", form);
    setFormOpen(false);
    setEditing(null);
    setForm(blank);
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this user?")) {
      await api.delete(`/users/${id}`);
      load();
    }
  };

  const filtered = useMemo(() => users.filter((user) => {
    const q = filters.search.toLowerCase();
    return !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q);
  }), [users, filters.search]);

  return (
    <div className="page-stack">
      <div className="page-actions">
        <div className="page-title"><h2>User Management</h2><p>Add, edit, delete, search, filter, and assign roles.</p></div>
        <button className="primary-btn" onClick={() => openForm()}><Plus size={18} /> Add User</button>
      </div>
      <div className="filters">
        <label className="search-box"><Search size={18} /><input placeholder="Search users" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /></label>
        <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All roles</option><option>Admin</option><option>Homeowner</option><option>Guest</option>
        </select>
      </div>
      <section className="table-panel">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Devices</th><th></th></tr></thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td><td>{user.email}</td><td><span className="status-pill">{user.role}</span></td>
                <td>{user.isActive ? "Active" : "Disabled"}</td><td>{user.accessibleDevices?.length || 0}</td>
                <td className="row-actions">
                  <button className="icon-btn" onClick={() => openForm(user)} title="Edit"><Edit size={16} /></button>
                  <button className="icon-btn danger" onClick={() => remove(user._id)} title="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <EmptyState title="No users found" />}
      </section>
      {formOpen && (
        <Modal title={editing ? "Edit User" : "Add User"} onClose={() => { setFormOpen(false); setEditing(null); setForm(blank); }}>
          <form className="form-grid" onSubmit={save}>
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            <label>Phone<input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Password<input type="password" placeholder={editing ? "Leave blank to keep" : ""} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} /></label>
            <label>Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option>Admin</option><option>Homeowner</option><option>Guest</option></select></label>
            <label>Status<select value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}><option value="true">Active</option><option value="false">Disabled</option></select></label>
            <div className="full field-group">
              <span>Accessible Devices</span>
              <div className="check-grid">
                {devices.map((device) => {
                  const selected = form.accessibleDevices.includes(device._id);
                  return (
                    <label className="check-row" key={device._id}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => {
                          const nextDevices = e.target.checked
                            ? [...form.accessibleDevices, device._id]
                            : form.accessibleDevices.filter((id) => id !== device._id);
                          setForm({ ...form, accessibleDevices: nextDevices });
                        }}
                      />
                      <span>{device.name}</span>
                      <small>{device.category} · {device.location}</small>
                    </label>
                  );
                })}
              </div>
            </div>
            <button className="primary-btn full" type="submit">Save User</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Users;
