import { Activity, Bell, Cpu, Power, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../components/MetricCard.jsx";
import { AnalyticsPanel, DeviceShowcase, FloorMap, SecurityCenter, SmartHomeOverview, WelcomeHero } from "../components/PremiumWidgets.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ categoryBreakdown: [], recentActivities: [] });

  useEffect(() => {
    api.get("/dashboard/admin").then(({ data }) => setStats(data));
  }, []);

  const chartData = stats.categoryBreakdown?.map((item) => ({ category: item._id, count: item.count })) || [];

  return (
    <div className="page-stack">
      <WelcomeHero user={user} totalDevices={stats.totalDevices || 0} activeDevices={stats.activeDevices || 0} />
      <SmartHomeOverview totalDevices={stats.totalDevices || 0} activeDevices={stats.activeDevices || 0} alerts={stats.unreadNotifications || 0} />
      <div className="page-title">
        <h2>Admin Dashboard</h2>
        <p>System-wide users, devices, alerts, and recent activity.</p>
      </div>
      <div className="metrics-grid">
        <MetricCard label="Total Users" value={stats.totalUsers || 0} icon={Users} tone="blue" />
        <MetricCard label="Total Devices" value={stats.totalDevices || 0} icon={Cpu} tone="green" />
        <MetricCard label="Active Devices" value={stats.activeDevices || 0} icon={Power} tone="yellow" />
        <MetricCard label="Unread Alerts" value={stats.unreadNotifications || 0} icon={Bell} tone="red" />
      </div>
      <div className="two-column">
        <section className="panel">
          <h3>Device Categories</h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2f80ed" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel">
          <h3><Activity size={18} /> Recent Activities</h3>
          <div className="activity-list">
            {stats.recentActivities?.map((item) => (
              <div key={item._id} className="activity-item">
                <strong>{item.action}</strong>
                <span>{item.description}</span>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
      <DeviceShowcase devices={stats.recentActivities?.map((item) => item.device).filter(Boolean) || []} readonly />
      <div className="two-column">
        <FloorMap />
        <SecurityCenter />
      </div>
      <AnalyticsPanel />
    </div>
  );
};

export default AdminDashboard;
