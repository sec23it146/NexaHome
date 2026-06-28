import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import DeviceCard from "../components/DeviceCard.jsx";
import MetricCard from "../components/MetricCard.jsx";
import { DeviceShowcase, FloorMap, SecurityCenter, SmartHomeOverview, WelcomeHero } from "../components/PremiumWidgets.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const GuestDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ devices: [] });
  useEffect(() => { api.get("/dashboard/homeowner").then(({ data }) => setStats(data)); }, []);

  return (
    <div className="page-stack">
      <WelcomeHero user={user} totalDevices={stats.totalDevices || 0} activeDevices={stats.activeDevices || 0} />
      <SmartHomeOverview totalDevices={stats.totalDevices || 0} activeDevices={stats.activeDevices || 0} alerts={stats.alerts || 0} />
      <div className="page-title">
        <h2>Guest Dashboard</h2>
        <p>Limited access to view and control selected devices.</p>
      </div>
      <div className="metrics-grid one">
        <MetricCard label="Visible Devices" value={stats.totalDevices || 0} icon={Eye} tone="blue" />
      </div>
      <section className="device-grid">
        {stats.devices?.map((device) => <DeviceCard key={device._id} device={device} onToggle={async (id) => {
          await api.patch(`/devices/${id}/toggle`);
          const { data } = await api.get("/dashboard/homeowner");
          setStats(data);
        }} />)}
      </section>
      <DeviceShowcase devices={stats.devices || []} onToggle={async (id) => {
        await api.patch(`/devices/${id}/toggle`);
        const { data } = await api.get("/dashboard/homeowner");
        setStats(data);
      }} />
      <div className="two-column">
        <FloorMap />
        <SecurityCenter />
      </div>
    </div>
  );
};

export default GuestDashboard;
