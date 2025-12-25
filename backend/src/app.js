const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const tenantRoutes = require("./routes/tenant.routes");
const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (MANDATORY)
const pool = require("./config/db");

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/tenants", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

// Server
const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
