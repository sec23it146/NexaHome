import express from "express";
import { createDevice, deleteDevice, getDevices, toggleDevice, updateDevice } from "../controllers/deviceController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/", getDevices);
router.post("/", authorize("Admin"), createDevice);
router.put("/:id", authorize("Admin"), updateDevice);
router.delete("/:id", authorize("Admin"), deleteDevice);
router.patch("/:id/toggle", authorize("Admin", "Homeowner", "Guest"), toggleDevice);

export default router;
