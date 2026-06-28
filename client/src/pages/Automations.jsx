import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState.jsx";
import Modal from "../components/Modal.jsx";
import api from "../services/api.js";

const blank = { name: "", conditionDevice: "", metric: "sensorValue", operator: ">", value: "30", actionDevice: "", action: "TURN_ON", enabled: true };

const Automations = () => {
  const [rules, setRules] = useState([]);
  const [devices, setDevices] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  const load = async () => {
    const [{ data: ruleData }, { data: deviceData }] = await Promise.all([api.get("/automations"), api.get("/devices")]);
    setRules(ruleData);
    setDevices(deviceData);
  };
  useEffect(() => { load(); }, []);

  const save = async (event) => {
    event.preventDefault();
    await api.post("/automations", form);
    setOpen(false);
    setForm(blank);
    load();
  };

  const toggle = async (rule) => {
    await api.put(`/automations/${rule._id}`, { enabled: !rule.enabled });
    load();
  };

  const remove = async (id) => {
    if (confirm("Delete this automation rule?")) {
      await api.delete(`/automations/${id}`);
      load();
    }
  };

  return (
    <div className="page-stack">
      <div className="page-actions">
        <div className="page-title"><h2>Automation Rules</h2><p>Example: IF temperature &gt; 30 C THEN turn ON fan.</p></div>
        <button className="primary-btn" onClick={() => setOpen(true)}><Plus size={18} /> New Rule</button>
      </div>
      <section className="rule-list">
        {rules.map((rule) => (
          <article className="rule-card" key={rule._id}>
            <div><strong>{rule.name}</strong><p>IF {rule.conditionDevice?.name} {rule.operator} {rule.value} THEN {rule.action.replace("_", " ")} {rule.actionDevice?.name}</p></div>
            <div className="row-actions">
              <label className="switch"><input type="checkbox" checked={rule.enabled} onChange={() => toggle(rule)} /><span /></label>
              <button className="icon-btn danger" onClick={() => remove(rule._id)} title="Delete"><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
        {!rules.length && <EmptyState title="No automation rules" />}
      </section>
      {open && (
        <Modal title="Create Automation Rule" onClose={() => setOpen(false)}>
          <form className="form-grid" onSubmit={save}>
            <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Condition Device<select value={form.conditionDevice} onChange={(e) => setForm({ ...form, conditionDevice: e.target.value })} required><option value="">Select device</option>{devices.map((device) => <option key={device._id} value={device._id}>{device.name}</option>)}</select></label>
            <label>Metric<select value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })}><option value="sensorValue">Sensor value</option><option value="status">Status</option></select></label>
            <label>Operator<select value={form.operator} onChange={(e) => setForm({ ...form, operator: e.target.value })}><option>&gt;</option><option>&gt;=</option><option>&lt;</option><option>&lt;=</option><option>==</option><option>!=</option></select></label>
            <label>Value<input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required /></label>
            <label>Action Device<select value={form.actionDevice} onChange={(e) => setForm({ ...form, actionDevice: e.target.value })} required><option value="">Select device</option>{devices.map((device) => <option key={device._id} value={device._id}>{device.name}</option>)}</select></label>
            <label>Action<select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}><option value="TURN_ON">Turn ON</option><option value="TURN_OFF">Turn OFF</option><option value="LOCK">Lock</option><option value="UNLOCK">Unlock</option></select></label>
            <button className="primary-btn full" type="submit">Save Rule</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Automations;
