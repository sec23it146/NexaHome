import ActivityLog from "../models/ActivityLog.js";

export const logActivity = ({ action, description, user, device, metadata = {} }) =>
  ActivityLog.create({ action, description, user, device, metadata });
