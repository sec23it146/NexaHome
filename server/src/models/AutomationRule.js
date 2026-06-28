import mongoose from "mongoose";

const automationRuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    conditionDevice: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
    metric: { type: String, enum: ["temperature", "sensorValue", "status"], default: "sensorValue" },
    operator: { type: String, enum: [">", ">=", "<", "<=", "==", "!="], required: true },
    value: { type: String, required: true },
    actionDevice: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
    action: { type: String, enum: ["TURN_ON", "TURN_OFF", "LOCK", "UNLOCK"], required: true },
    enabled: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const AutomationRule = mongoose.model("AutomationRule", automationRuleSchema);
export default AutomationRule;
