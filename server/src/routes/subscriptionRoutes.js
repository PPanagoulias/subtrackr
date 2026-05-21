import express from "express";
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscriptionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSubscriptions);
router.get("/:id", authMiddleware, getSubscriptionById);
router.post("/", authMiddleware, createSubscription);
router.put("/:id", authMiddleware, updateSubscription);
router.delete("/:id", authMiddleware, deleteSubscription);

export default router;