import express from "express";
import { deleteNotification, getNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);
router.delete("/:id", authorize("Admin"), deleteNotification);

export default router;
