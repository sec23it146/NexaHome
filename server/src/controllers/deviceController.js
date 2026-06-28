import Device from "../models/Device.js";
import { evaluateAutomationRules } from "../services/automationService.js";
import { logActivity } from "../services/logService.js";
import { createNotification } from "../services/notificationService.js";

const userDeviceQuery = (user) => {
  if (user.role === "Admin") return {};
  return { $or: [{ assignedTo: user._id }, { _id: { $in: user.accessibleDevices || [] } }] };
};

export const getDevices = async (req, res) => {
  const { search = "", category = "", status = "" } = req.query;
  const query = userDeviceQuery(req.user);
  if (search) {
    const searchQuery = [{ name: new RegExp(search, "i") }, { location: new RegExp(search, "i") }];
    if (query.$or) {
      query.$and = [{ $or: query.$or }, { $or: searchQuery }];
      delete query.$or;
    } else {
      query.$or = searchQuery;
    }
  }
  if (category) query.category = category;
  if (status) query.status = status;

  const devices = await Device.find(query).populate("assignedTo", "name email role");
  res.json(devices);
};

export const createDevice = async (req, res) => {
  const assignedTo = req.body.assignedTo || [];
  const device = await Device.create({ ...req.body, assignedTo, createdBy: req.user._id });
  await logActivity({
    action: "DEVICE_CREATED",
    description: `${req.user.name} added ${device.name}`,
    user: req.user._id,
    device: device._id
  });
  res.status(201).json(await device.populate("assignedTo", "name email role"));
};

export const updateDevice = async (req, res) => {
  const device = await Device.findOneAndUpdate({ _id: req.params.id, ...userDeviceQuery(req.user) }, req.body, {
    new: true,
    runValidators: true
  }).populate("assignedTo", "name email role");
  if (!device) return res.status(404).json({ message: "Device not found" });

  await logActivity({
    action: "DEVICE_UPDATED",
    description: `${req.user.name} updated ${device.name}`,
    user: req.user._id,
    device: device._id
  });
  await evaluateAutomationRules(device, req.user._id);
  res.json(device);
};

export const deleteDevice = async (req, res) => {
  const device = await Device.findByIdAndDelete(req.params.id);
  if (!device) return res.status(404).json({ message: "Device not found" });
  await logActivity({
    action: "DEVICE_DELETED",
    description: `${req.user.name} deleted ${device.name}`,
    user: req.user._id,
    device: device._id
  });
  res.json({ message: "Device deleted" });
};

export const toggleDevice = async (req, res) => {
  const device = await Device.findOne({ _id: req.params.id, ...userDeviceQuery(req.user) });
  if (!device) return res.status(404).json({ message: "Device not found" });

  if (device.category === "Door Lock") {
    device.status = device.status === "LOCKED" ? "UNLOCKED" : "LOCKED";
    device.isActive = device.status === "LOCKED";
  } else {
    device.isActive = !device.isActive;
    device.status = device.isActive ? "ON" : "OFF";
  }
  await device.save();

  await logActivity({
    action: "DEVICE_TOGGLED",
    description: `${req.user.name} changed ${device.name} to ${device.status}`,
    user: req.user._id,
    device: device._id
  });
  await createNotification({
    title: "Device status changed",
    message: `${device.name} is now ${device.status}.`,
    type: device.category === "Sensor" ? "Sensor" : device.category === "Door Lock" ? "Security" : "Device",
    severity: device.status === "ALERT" ? "critical" : "info",
    device: device._id
  });
  await evaluateAutomationRules(device, req.user._id);

  res.json(device);
};
