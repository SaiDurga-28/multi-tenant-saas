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
