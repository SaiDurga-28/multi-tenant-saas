const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTask,
  listTasks,
  updateTaskStatus,
  updateTask
} = require("../controllers/task.controller");

router.post("/projects/:projectId/tasks", authMiddleware, createTask);
router.get("/projects/:projectId/tasks", authMiddleware, listTasks);
router.patch("/tasks/:taskId/status", authMiddleware, updateTaskStatus);
router.put("/tasks/:taskId", authMiddleware, updateTask);

module.exports = router;
