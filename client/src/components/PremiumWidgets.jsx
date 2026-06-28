import {
  Activity,
  AirVent,
  BatteryCharging,
  CalendarClock,
  Camera,
  CloudSun,
  Droplets,
  Flame,
  Home,
  Lock,
  PlugZap,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Thermometer,
  TrendingUp,
  Tv
} from "lucide-react";
import { motion } from "framer-motion";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const energyData = [
  { day: "Mon", energy: 18, usage: 42 },
  { day: "Tue", energy: 24, usage: 51 },
  { day: "Wed", energy: 20, usage: 46 },
  { day: "Thu", energy: 31, usage: 63 },
  { day: "Fri", energy: 27, usage: 58 },
  { day: "Sat", energy: 35, usage: 70 },
  { day: "Sun", energy: 29, usage: 61 }
];

const rooms = [
  { name: "Living Room", x: 18, y: 24, active: true },
  { name: "Bedroom", x: 62, y: 22, active: true },
  { name: "Kitchen", x: 24, y: 68, active: false },
  { name: "Garage", x: 70, y: 67, active: true },
  { name: "Garden", x: 48, y: 47, active: true }
];

const securityEvents = [
  "Main door locked successfully",
  "Motion sensor clear in garage",
  "Camera feed stable",
  "Guest access device control verified"
];

export const WelcomeHero = ({ user, totalDevices = 0, activeDevices = 0 }) => {
  const now = new Date();
  return (
    <motion.section className="hero-console" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div>
        <span className="eyebrow"><Sparkles size={16} /> Smart Control Center</span>
        <h2>Welcome back, {user?.name || "User"}</h2>
        <p>{now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} - {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <div className="hero-widgets">
        <div className="mini-weather">
          <CloudSun size={28} />
          <strong>28 C</strong>
          <span>Clear - smart climate ready</span>
        </div>
        <div className="home-health">
          <ShieldCheck size={28} />
          <strong>{activeDevices}/{totalDevices}</strong>
          <span>Devices active</span>
        </div>
      </div>
    </motion.section>
  );
};

export const PremiumMetric = ({ label, value, icon: Icon, tone = "blue", suffix = "" }) => (
  <motion.article className={`premium-metric tone-${tone}`} whileHover={{ y: -6, scale: 1.015 }}>
    <div className="metric-glow" />
    <span className="metric-icon"><Icon size={22} /></span>
    <p>{label}</p>
    <strong>{value}{suffix}</strong>
    <small><span className="live-dot" /> Live status</small>
  </motion.article>
);

export const SmartHomeOverview = ({ totalDevices = 0, activeDevices = 0, alerts = 0 }) => (
  <div className="premium-grid six">
    <PremiumMetric label="Total Devices" value={totalDevices} icon={Home} tone="blue" />
    <PremiumMetric label="Active Devices" value={activeDevices} icon={Activity} tone="emerald" />
    <PremiumMetric label="Energy" value={Math.max(12, activeDevices * 7)} suffix=" kWh" icon={BatteryCharging} tone="cyan" />
    <PremiumMetric label="Security" value={alerts ? "Alert" : "Secure"} icon={ShieldCheck} tone={alerts ? "purple" : "emerald"} />
    <PremiumMetric label="Temperature" value="24" suffix=" C" icon={Thermometer} tone="purple" />
    <PremiumMetric label="Humidity" value="46" suffix="%" icon={Droplets} tone="cyan" />
  </div>
);

export const DeviceShowcase = ({ devices = [], onToggle, readonly = false }) => {
  const categoryIcons = {
    "Smart Light": Flame,
    Fan: AirVent,
    "Door Lock": Lock,
    Sensor: RadioTower,
    "Smart TV": Tv,
    CCTV: Camera,
    Plug: PlugZap,
    AC: AirVent
  };
  const placeholderDevices = [
    { name: "Smart Lights", location: "Demo zone", category: "Smart Light", status: "OFF", isActive: false },
    { name: "Fans", location: "Demo zone", category: "Fan", status: "OFF", isActive: false },
    { name: "Door Locks", location: "Demo zone", category: "Door Lock", status: "LOCKED", isActive: false },
    { name: "Motion Sensors", location: "Demo zone", category: "Sensor", status: "OFF", isActive: false }
  ];
  const visibleDevices = devices.length ? devices : placeholderDevices;

  return (
    <section className="premium-panel">
      <div className="section-head">
        <div>
          <span className="eyebrow">Smart Devices</span>
          <h3>Monitor and control connected devices</h3>
        </div>
      </div>
      <div className="showcase-grid">
        {visibleDevices.map((device, index) => {
          const Icon = categoryIcons[device.category] || RadioTower;
          const active = device.isActive || ["ON", "LOCKED"].includes(device.status);
          const isPlaceholder = !devices.length;
          return (
            <motion.article className="showcase-card" key={device._id || device.name} whileHover={{ y: -8 }}>
              <span className="device-orb"><Icon size={24} /></span>
              <div>
                <h4>{device.name}</h4>
                <p>{device.location || "Smart zone"} - {device.category}</p>
              </div>
              <div className="energy-line">
                <span>{active ? "Online" : "Idle"}</span>
                <strong>{active ? 12 + index * 3 : 0}W</strong>
              </div>
              <button
                className={`smart-switch ${active ? "active" : ""}`}
                disabled={readonly || isPlaceholder}
                onClick={() => onToggle?.(device._id)}
                title={isPlaceholder ? "Assign devices to enable control" : "Toggle device"}
              >
                <b>{active ? "ON" : "OFF"}</b>
                <span />
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export const FloorMap = () => (
  <section className="premium-panel floor-panel">
    <div className="section-head">
      <div>
        <span className="eyebrow">Floor Map</span>
        <h3>Interactive home layout</h3>
      </div>
    </div>
    <div className="floor-map">
      {rooms.map((room) => (
        <button className={`room-pin ${room.active ? "active" : ""}`} style={{ left: `${room.x}%`, top: `${room.y}%` }} key={room.name}>
          <span />
          {room.name}
        </button>
      ))}
      <div className="room-zone living">Living Room</div>
      <div className="room-zone bedroom">Bedroom</div>
      <div className="room-zone kitchen">Kitchen</div>
      <div className="room-zone garage">Garage</div>
    </div>
  </section>
);

export const AnalyticsPanel = () => (
  <section className="premium-panel">
    <div className="section-head">
      <div>
        <span className="eyebrow">Analytics</span>
        <h3>Energy and device usage trends</h3>
      </div>
      <TrendingUp size={22} />
    </div>
    <div className="chart-box premium-chart">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={energyData}>
          <defs>
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.55} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
          <XAxis dataKey="day" stroke="currentColor" />
          <YAxis stroke="currentColor" />
          <Tooltip />
          <Area type="monotone" dataKey="energy" stroke="#3B82F6" fill="url(#energyFill)" strokeWidth={3} />
          <Area type="monotone" dataKey="usage" stroke="#06B6D4" fill="transparent" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export const SecurityCenter = () => (
  <section className="premium-panel security-panel">
    <div className="section-head">
      <div>
        <span className="eyebrow">Security Center</span>
        <h3>Door locks, motion alerts, and camera feed</h3>
      </div>
      <ShieldCheck size={22} />
    </div>
    <div className="security-grid">
      <div className="camera-preview">
        <Camera size={34} />
        <strong>Live Preview</strong>
        <span>Entrance camera - 1080p</span>
      </div>
      <div className="security-events">
        {securityEvents.map((event) => (
          <p key={event}><span className="live-dot" /> {event}</p>
        ))}
      </div>
    </div>
  </section>
);

export const SchedulePanel = () => (
  <section className="premium-panel schedule-panel">
    <div className="section-head">
      <div>
        <span className="eyebrow">Schedule</span>
        <h3>Automation timeline</h3>
      </div>
      <CalendarClock size={22} />
    </div>
    <div className="timeline">
      <p><span /> 06:30 - Lights warm up</p>
      <p><span /> 18:00 - Security scan</p>
      <p><span /> 22:30 - Night mode enabled</p>
    </div>
  </section>
);
