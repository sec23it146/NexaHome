import { Bell, Layers3, Settings, ShieldCheck } from "lucide-react";
import { AnalyticsPanel, FloorMap, SchedulePanel, SecurityCenter, SmartHomeOverview, WelcomeHero } from "../components/PremiumWidgets.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const pageMap = {
  rooms: {
    title: "Rooms",
    text: "Interactive rooms view with glowing device locations.",
    icon: Layers3,
    content: <FloorMap />
  },
  security: {
    title: "Security Center",
    text: "Door locks, camera preview, motion alerts, and recent events.",
    icon: ShieldCheck,
    content: <SecurityCenter />
  },
  reports: {
    title: "Reports",
    text: "Weekly and monthly analytics for energy and device usage.",
    icon: Bell,
    content: <AnalyticsPanel />
  },
  settings: {
    title: "Settings",
    text: "Premium workspace preferences and smart home configuration.",
    icon: Settings,
    content: <SchedulePanel />
  }
};

const PremiumInfoPage = ({ type }) => {
  const { user } = useAuth();
  const page = pageMap[type] || pageMap.rooms;
  const Icon = page.icon;

  return (
    <div className="page-stack">
      <WelcomeHero user={user} totalDevices={8} activeDevices={6} />
      <div className="page-title premium-title">
        <span className="metric-icon"><Icon size={22} /></span>
        <div>
          <h2>{page.title}</h2>
          <p>{page.text}</p>
        </div>
      </div>
      <SmartHomeOverview totalDevices={8} activeDevices={6} alerts={0} />
      {page.content}
    </div>
  );
};

export default PremiumInfoPage;
