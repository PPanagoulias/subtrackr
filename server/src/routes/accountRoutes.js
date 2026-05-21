import express from "express";
import { changePassword } from "../controllers/accountController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/change-password", authMiddleware, changePassword);

export default router;