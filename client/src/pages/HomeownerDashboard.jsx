import { AlertTriangle, Cpu, Power } from "lucide-react";
import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard.jsx";
import MetricCard from "../components/MetricCard.jsx";
import { AnalyticsPanel, DeviceShowcase, FloorMap, SecurityCenter, SmartHomeOverview, WelcomeHero } from "../components/PremiumWidgets.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const HomeownerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ devices: [], notifications: [], recentActivities: [] });

  const load = () => api.get("/dashboard/homeowner").then(({ data }) => setStats(data));
  useEffect(() => { load(); }, []);

  const toggle = async (id) => {
    await api.patch(`/devices/${id}/toggle`);
    load();
  };

  return (
    <div className="page-stack">
      <WelcomeHero user={user} totalDevices={stats.totalDevices || 0} activeDevices={stats.activeDevices || 0} />
      <SmartHomeOverview totalDevices={stats.totalDevices || 0} activeDevices={stats.activeDevices || 0} alerts={stats.alerts || 0} />
      <div className="page-title">
        <h2>Homeowner Dashboard</h2>
        <p>Monitor assigned devices, control rooms, and review alerts.</p>
      </div>
      <div className="metrics-grid">
        <MetricCard label="Assigned Devices" value={stats.totalDevices || 0} icon={Cpu} tone="blue" />
        <MetricCard label="Active Devices" value={stats.activeDevices || 0} icon={Power} tone="green" />
        <MetricCard label="Alerts" value={stats.alerts || 0} icon={AlertTriangle} tone="red" />
      </div>
      <section className="device-grid">
        {stats.devices?.map((device) => <DeviceCard key={device._id} device={device} onToggle={toggle} />)}
      </section>
      <DeviceShowcase devices={stats.devices || []} onToggle={toggle} />
      <div className="two-column">
        <FloorMap />
        <SecurityCenter />
      </div>
      <AnalyticsPanel />
      <div className="two-column">
        <section className="panel">
          <h3>Notifications</h3>
          {stats.notifications?.map((note) => <p className="line-item" key={note._id}>{note.title}: {note.message}</p>)}
        </section>
        <section className="panel">
          <h3>Activity History</h3>
          {stats.recentActivities?.map((log) => <p className="line-item" key={log._id}>{log.description}</p>)}
        </section>
      </div>
    </div>
  );
};

export default HomeownerDashboard;
