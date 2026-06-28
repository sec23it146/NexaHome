import User from "../models/User.js";
import { logActivity } from "../services/logService.js";
import { signToken } from "../services/tokenService.js";

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  isActive: user.isActive,
  accessibleDevices: user.accessibleDevices
});

export const register = async (req, res) => {
  const { name, email, password, role = "Homeowner", phone = "" } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const userCount = await User.countDocuments();
  const protectedRole = userCount === 0 ? "Admin" : role === "Admin" ? "Homeowner" : role;
  const user = await User.create({ name, email, password, role: protectedRole, phone });
  await logActivity({ action: "USER_REGISTERED", description: `${user.name} registered`, user: user._id });

  res.status(201).json({ user: userResponse(user), token: signToken(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (!user.isActive) return res.status(403).json({ message: "Account is disabled" });

  await logActivity({ action: "USER_LOGIN", description: `${user.name} logged in`, user: user._id });
  res.json({ user: userResponse(user), token: signToken(user) });
};

export const me = async (req, res) => {
  res.json({ user: userResponse(req.user) });
};
