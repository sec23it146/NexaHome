import Notification from "../models/Notification.js";
import { emitAll, emitToUser } from "../config/socket.js";

export const createNotification = async (payload) => {
  const notification = await Notification.create(payload);
  if (payload.user) emitToUser(payload.user, "notification", notification);
  emitAll("notification:new", notification);
  return notification;
};
