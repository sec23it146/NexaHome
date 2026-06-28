import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import ActivityLog from "./models/ActivityLog.js";
import AutomationRule from "./models/AutomationRule.js";
import Device from "./models/Device.js";
import Notification from "./models/Notification.js";
import User from "./models/User.js";

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Device.deleteMany({}),
    AutomationRule.deleteMany({}),
    Notification.deleteMany({}),
    ActivityLog.deleteMany({})
  ]);

  const [admin, homeowner, guest] = await User.create([
    { name: "Admin User", email: "admin@smarthome.com", password: "Admin123", role: "Admin", phone: "+1 555 0101" },
    { name: "Home Owner", email: "owner@smarthome.com", password: "Owner123", role: "Homeowner", phone: "+1 555 0102" },
    { name: "Guest User", email: "guest@smarthome.com", password: "Guest123", role: "Guest", phone: "+1 555 0103" }
  ]);

  const devices = await Device.create([
    {
      name: "Living Room Light",
      category: "Smart Light",
      location: "Living Room",
      status: "ON",
      isActive: true,
      assignedTo: [homeowner._id, guest._id],
      createdBy: admin._id
    },
    {
      name: "Bedroom Fan",
      category: "Fan",
      location: "Bedroom",
      status: "OFF",
      isActive: false,
      assignedTo: [homeowner._id],
      createdBy: admin._id
    },
    {
      name: "Main Door Lock",
      category: "Door Lock",
      location: "Entrance",
      status: "LOCKED",
      isActive: true,
      assignedTo: [homeowner._id, guest._id],
      createdBy: admin._id
    },
    {
      name: "Temperature Sensor",
      category: "Sensor",
      location: "Hallway",
      status: "ON",
      isActive: true,
      sensorValue: 32,
      sensorUnit: "C",
      assignedTo: [homeowner._id],
      createdBy: admin._id
    }
  ]);

  homeowner.accessibleDevices = devices.map((device) => device._id);
  guest.accessibleDevices = [devices[0]._id, devices[2]._id];
  await homeowner.save();
  await guest.save();

  await AutomationRule.create({
    name: "High temperature cooling",
    conditionDevice: devices[3]._id,
    metric: "sensorValue",
    operator: ">",
    value: "30",
    actionDevice: devices[1]._id,
    action: "TURN_ON",
    enabled: true,
    createdBy: admin._id
  });

  await Notification.create([
    {
      title: "System ready",
      message: "Smart home automation demo data has been created.",
      type: "System",
      severity: "info",
      user: admin._id
    },
    {
      title: "Sensor alert",
      message: "Temperature Sensor is above 30 C.",
      type: "Sensor",
      severity: "warning",
      device: devices[3]._id
    }
  ]);

  await ActivityLog.create([
    { action: "SEED_CREATED", description: "Demo smart home data seeded", user: admin._id },
    { action: "DEVICE_TOGGLED", description: "Living Room Light turned ON", user: homeowner._id, device: devices[0]._id }
  ]);

  console.log("Seed complete");
  console.table([
    { role: "Admin", email: "admin@smarthome.com", password: "Admin123" },
    { role: "Homeowner", email: "owner@smarthome.com", password: "Owner123" },
    { role: "Guest", email: "guest@smarthome.com", password: "Guest123" }
  ]);
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
