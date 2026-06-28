import express from "express";
import { adminStats, homeownerStats } from "../controllers/dashboardController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, authorize("Admin"), adminStats);
router.get("/homeowner", protect, authorize("Admin", "Homeowner", "Guest"), homeownerStats);

export default router;
