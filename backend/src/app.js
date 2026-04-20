import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/auth.js";

export const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/leads", requireAuth, leadRoutes);
app.use("/api/companies", requireAuth, companyRoutes);
app.use("/api/tasks", requireAuth, taskRoutes);
app.use("/api/users", requireAuth, userRoutes);

app.use(notFound);
app.use(errorHandler);
