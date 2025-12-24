const pool = require("../config/db");

// CREATE task
exports.createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo } = req.body;
  const user = req.user;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const project = await pool.query(
      "SELECT tenant_id FROM projects WHERE id = $1",
      [projectId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.rows[0].tenant_id !== user.tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate assignee belongs to same tenant
    if (assignedTo) {
      const assignee = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND tenant_id = $2",
        [assignedTo, user.tenantId]
      );

      if (assignee.rows.length === 0) {
        return res.status(400).json({ message: "Invalid assignee" });
      }
    }

    await pool.query(
      `INSERT INTO tasks (project_id, tenant_id, title, description, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [projectId, user.tenantId, title, description, assignedTo, user.userId]
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// LIST tasks
exports.listTasks = async (req, res) => {
  const { projectId } = req.params;
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  try {
    const project = await pool.query(
      "SELECT tenant_id FROM projects WHERE id = $1",
      [projectId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.rows[0].tenant_id !== user.tenantId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await pool.query(
      `SELECT id, title, description, status, assigned_to, created_at
       FROM tasks
       WHERE project_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [projectId, limit, offset]
    );

    const total = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE project_id = $1",
      [projectId]
    );

    res.json({
      success: true,
      data: {
        tasks: tasks.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total.rows[0].count / limit),
          totalTasks: parseInt(total.rows[0].count),
          limit
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// UPDATE task status
exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const user = req.user;

  try {
    const task = await pool.query(
      "SELECT tenant_id, assigned_to FROM tasks WHERE id = $1",
      [taskId]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { tenant_id, assigned_to } = task.rows[0];

    if (
      user.tenantId !== tenant_id ||
      (user.role !== "tenant_admin" && user.userId !== assigned_to)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      "UPDATE tasks SET status = $1 WHERE id = $2",
      [status, taskId]
    );

    res.json({ success: true, message: "Task status updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// UPDATE task details
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo } = req.body;
  const user = req.user;

  try {
    const task = await pool.query(
      `SELECT t.tenant_id, p.created_by
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE t.id = $1`,
      [taskId]
    );

    if (task.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    const { tenant_id, created_by } = task.rows[0];

    if (
      user.tenantId !== tenant_id ||
      (user.role !== "tenant_admin" && user.userId !== created_by)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (assignedTo) {
      const assignee = await pool.query(
        "SELECT id FROM users WHERE id = $1 AND tenant_id = $2",
        [assignedTo, user.tenantId]
      );

      if (assignee.rows.length === 0) {
        return res.status(400).json({ message: "Invalid assignee" });
      }
    }

    await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, assigned_to = $3
       WHERE id = $4`,
      [title, description, assignedTo, taskId]
    );

    res.json({ success: true, message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
