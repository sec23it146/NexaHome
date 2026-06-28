import express from "express";
import { exportActivityLogs, getActivityLogs } from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getActivityLogs);
router.get("/export", exportActivityLogs);

export default router;
