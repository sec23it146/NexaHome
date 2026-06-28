import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Smart Light", "Fan", "Door Lock", "Sensor"],
      required: true
    },
    location: { type: String, required: true, trim: true },
    status: { type: String, enum: ["ON", "OFF", "LOCKED", "UNLOCKED", "ALERT"], default: "OFF" },
    isActive: { type: Boolean, default: false },
    sensorValue: { type: Number, default: null },
    sensorUnit: { type: String, default: "" },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

deviceSchema.index({ name: "text", location: "text", category: "text" });

const Device = mongoose.model("Device", deviceSchema);
export default Device;
