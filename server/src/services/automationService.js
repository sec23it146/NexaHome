import AutomationRule from "../models/AutomationRule.js";
import Device from "../models/Device.js";
import { logActivity } from "./logService.js";
import { createNotification } from "./notificationService.js";

const compare = (left, operator, right) => {
  const numericLeft = Number(left);
  const numericRight = Number(right);
  const useNumeric = Number.isFinite(numericLeft) && Number.isFinite(numericRight);
  const a = useNumeric ? numericLeft : String(left);
  const b = useNumeric ? numericRight : String(right);

  switch (operator) {
    case ">":
      return a > b;
    case ">=":
      return a >= b;
    case "<":
      return a < b;
    case "<=":
      return a <= b;
    case "==":
      return a == b;
    case "!=":
      return a != b;
    default:
      return false;
  }
};

const actionToStatus = (action) => {
  if (action === "TURN_ON") return { status: "ON", isActive: true };
  if (action === "TURN_OFF") return { status: "OFF", isActive: false };
  if (action === "LOCK") return { status: "LOCKED", isActive: true };
  return { status: "UNLOCKED", isActive: false };
};

export const evaluateAutomationRules = async (changedDevice, actorId) => {
  const rules = await AutomationRule.find({ enabled: true, conditionDevice: changedDevice._id });
  const triggered = [];

  for (const rule of rules) {
    const left = rule.metric === "status" ? changedDevice.status : changedDevice.sensorValue;
    if (!compare(left, rule.operator, rule.value)) continue;

    const update = actionToStatus(rule.action);
    const actionDevice = await Device.findByIdAndUpdate(rule.actionDevice, update, { new: true });
    if (!actionDevice) continue;

    await logActivity({
      action: "AUTOMATION_TRIGGERED",
      description: `${rule.name} triggered and changed ${actionDevice.name} to ${update.status}`,
      user: actorId,
      device: actionDevice._id,
      metadata: { rule: rule._id, conditionDevice: changedDevice._id }
    });

    await createNotification({
      title: "Automation triggered",
      message: `${rule.name} changed ${actionDevice.name} to ${update.status}.`,
      type: "System",
      severity: "info",
      device: actionDevice._id
    });

    triggered.push({ rule, actionDevice });
  }

  return triggered;
};
