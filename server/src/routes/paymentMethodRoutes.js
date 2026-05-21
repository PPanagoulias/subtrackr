import express from "express";
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethodController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getPaymentMethods);
router.post("/", authMiddleware, createPaymentMethod);
router.put("/:id", authMiddleware, updatePaymentMethod);
router.delete("/:id", authMiddleware, deletePaymentMethod);

export default router;