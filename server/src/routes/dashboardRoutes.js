import express from "express";
import {
  getDashboardSummary,
  getDashboardCharts,
} from "../controllers/dashboardController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/summary", authMiddleware, getDashboardSummary);
router.get("/charts", authMiddleware, getDashboardCharts);

export default router;
