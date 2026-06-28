import User from "../models/User.js";
import { logActivity } from "../services/logService.js";

export const getUsers = async (req, res) => {
  const { search = "", role = "", active = "" } = req.query;
  const query = {};
  if (search) query.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];
  if (role) query.role = role;
  if (active !== "") query.isActive = active === "true";

  const users = await User.find(query).select("-password").populate("accessibleDevices", "name category location status");
  res.json(users);
};

export const createUser = async (req, res) => {
  const user = await User.create(req.body);
  await logActivity({
    action: "USER_CREATED",
    description: `${req.user.name} created ${user.name}`,
    user: req.user._id
  });
  const safeUser = await User.findById(user._id).select("-password").populate("accessibleDevices", "name category location status");
  res.status(201).json(safeUser);
};

export const updateUser = async (req, res) => {
  const updates = { ...req.body };
  if (!updates.password) delete updates.password;
  const user = await User.findById(req.params.id).select("+password");
  if (!user) return res.status(404).json({ message: "User not found" });

  Object.assign(user, updates);
  await user.save();
  await logActivity({
    action: "USER_UPDATED",
    description: `${req.user.name} updated ${user.name}`,
    user: req.user._id,
    metadata: { targetUser: user._id }
  });

  const safeUser = await User.findById(user._id).select("-password").populate("accessibleDevices", "name category location status");
  res.json(safeUser);
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await logActivity({
    action: "USER_DELETED",
    description: `${req.user.name} deleted ${user.name}`,
    user: req.user._id,
    metadata: { targetUser: user._id }
  });
  res.json({ message: "User deleted" });
};
