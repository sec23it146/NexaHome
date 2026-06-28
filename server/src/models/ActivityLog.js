import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
    metadata: { type: Object, default: {} }
  },
  { timestamps: true }
);

activityLogSchema.index({ action: "text", description: "text" });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
