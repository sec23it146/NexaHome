import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["Device", "Security", "Sensor", "System"], default: "System" },
    severity: { type: String, enum: ["info", "warning", "critical"], default: "info" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
