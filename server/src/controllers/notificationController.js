import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const query = req.user.role === "Admin" ? {} : { $or: [{ user: req.user._id }, { user: null }] };
  const notifications = await Notification.find(query).populate("device", "name category").sort({ createdAt: -1 }).limit(100);
  res.json(notifications);
};

export const markNotificationRead = async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json(notification);
};

export const deleteNotification = async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json({ message: "Notification deleted" });
};
