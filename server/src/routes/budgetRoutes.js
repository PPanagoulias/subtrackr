import express from "express";
import {
  getBudget,
  createBudget,
  updateBudget,
} from "../controllers/budgetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getBudget);
router.post("/", authMiddleware, createBudget);
router.put("/:id", authMiddleware, updateBudget);

export default router;
