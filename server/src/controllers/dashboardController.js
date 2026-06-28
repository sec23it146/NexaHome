import ActivityLog from "../models/ActivityLog.js";
import Device from "../models/Device.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const adminStats = async (_req, res) => {
  const [totalUsers, totalDevices, activeDevices, recentActivities, unreadNotifications, categoryBreakdown] = await Promise.all([
    User.countDocuments(),
    Device.countDocuments(),
    Device.countDocuments({ isActive: true }),
    ActivityLog.find().populate("user", "name role").populate("device", "name category").sort({ createdAt: -1 }).limit(8),
    Notification.countDocuments({ read: false }),
    Device.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])
  ]);

  res.json({ totalUsers, totalDevices, activeDevices, recentActivities, unreadNotifications, categoryBreakdown });
};

export const homeownerStats = async (req, res) => {
  const assignedQuery = {
    $or: [{ assignedTo: req.user._id }, { _id: { $in: req.user.accessibleDevices || [] } }]
  };
  const [devices, recentActivities, notifications] = await Promise.all([
    Device.find(assignedQuery),
    ActivityLog.find({ user: req.user._id }).populate("device", "name category").sort({ createdAt: -1 }).limit(8),
    Notification.find({ $or: [{ user: req.user._id }, { user: null }] }).sort({ createdAt: -1 }).limit(8)
  ]);

  res.json({
    totalDevices: devices.length,
    activeDevices: devices.filter((device) => device.isActive).length,
    alerts: devices.filter((device) => device.status === "ALERT").length,
    devices,
    recentActivities,
    notifications
  });
};
