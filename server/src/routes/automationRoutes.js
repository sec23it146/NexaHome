import express from "express";
import { createAutomationRule, deleteAutomationRule, getAutomationRules, updateAutomationRule } from "../controllers/automationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, authorize("Admin", "Homeowner"));
router.route("/").get(getAutomationRules).post(createAutomationRule);
router.route("/:id").put(updateAutomationRule).delete(deleteAutomationRule);

export default router;
