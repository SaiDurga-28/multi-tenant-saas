const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const tenantRoutes = require("./routes/tenant.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

/* 🔴 VERY IMPORTANT: ROOT ENDPOINT */
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend running" });
});

/* 🔴 MANDATORY HEALTH CHECK */
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      database: "connected"
    });
  } catch {
    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/tenants", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

/* 🔴 LISTEN ON 0.0.0.0 */
const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
