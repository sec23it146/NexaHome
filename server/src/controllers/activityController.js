import ActivityLog from "../models/ActivityLog.js";

export const getActivityLogs = async (req, res) => {
  const { search = "", action = "" } = req.query;
  const query = {};
  if (req.user.role !== "Admin") query.user = req.user._id;
  if (search) query.$or = [{ action: new RegExp(search, "i") }, { description: new RegExp(search, "i") }];
  if (action) query.action = action;

  const logs = await ActivityLog.find(query).populate("user", "name email role").populate("device", "name category").sort({ createdAt: -1 }).limit(500);
  res.json(logs);
};

export const exportActivityLogs = async (req, res) => {
  const query = req.user.role === "Admin" ? {} : { user: req.user._id };
  const logs = await ActivityLog.find(query).populate("user", "name email role").populate("device", "name category").sort({ createdAt: -1 });
  const rows = [
    ["Timestamp", "Action", "Description", "User", "Device"],
    ...logs.map((log) => [
      log.createdAt.toISOString(),
      log.action,
      log.description,
      log.user?.email || "",
      log.device?.name || ""
    ])
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  res.header("Content-Type", "text/csv");
  res.attachment("activity-logs.csv");
  res.send(csv);
};
