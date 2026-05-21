import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import paymentMethodRoutes from "./routes/paymentMethodRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/account", accountRoutes);

app.get("/", function (req, res) {
  res.json({
    message: "SubTrackr API is running",
  });
});

app.get("/api/health", function (req, res) {
  res.json({
    status: "ok",
    app: "SubTrackr API",
  });
});

const server = app.listen(PORT, function () {
  console.log(`SubTrackr API running on port ${PORT}`);
});

server.on("error", function (error) {
  console.error("Server error:", error);
});
