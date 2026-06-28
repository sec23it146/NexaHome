import AutomationRule from "../models/AutomationRule.js";
import { logActivity } from "../services/logService.js";

export const getAutomationRules = async (_req, res) => {
  const rules = await AutomationRule.find()
    .populate("conditionDevice", "name category status sensorValue")
    .populate("actionDevice", "name category status");
  res.json(rules);
};

export const createAutomationRule = async (req, res) => {
  const rule = await AutomationRule.create({ ...req.body, createdBy: req.user._id });
  await logActivity({
    action: "AUTOMATION_CREATED",
    description: `${req.user.name} created automation ${rule.name}`,
    user: req.user._id,
    metadata: { rule: rule._id }
  });
  res.status(201).json(await rule.populate("conditionDevice actionDevice"));
};

export const updateAutomationRule = async (req, res) => {
  const rule = await AutomationRule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate("conditionDevice", "name category status sensorValue")
    .populate("actionDevice", "name category status");
  if (!rule) return res.status(404).json({ message: "Rule not found" });
  await logActivity({
    action: "AUTOMATION_UPDATED",
    description: `${req.user.name} updated automation ${rule.name}`,
    user: req.user._id,
    metadata: { rule: rule._id }
  });
  res.json(rule);
};

export const deleteAutomationRule = async (req, res) => {
  const rule = await AutomationRule.findByIdAndDelete(req.params.id);
  if (!rule) return res.status(404).json({ message: "Rule not found" });
  await logActivity({
    action: "AUTOMATION_DELETED",
    description: `${req.user.name} deleted automation ${rule.name}`,
    user: req.user._id,
    metadata: { rule: rule._id }
  });
  res.json({ message: "Automation rule deleted" });
};
