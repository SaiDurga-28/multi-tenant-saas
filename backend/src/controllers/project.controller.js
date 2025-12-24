const pool = require("../config/db");

// CREATE project
exports.createProject = async (req, res) => {
  const user = req.user;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  try {
    // Check subscription limit
    const projectCount = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
      [user.tenantId]
    );

    const tenant = await pool.query(
      "SELECT max_projects FROM tenants WHERE id = $1",
      [user.tenantId]
    );

    if (
      parseInt(projectCount.rows[0].count) >= tenant.rows[0].max_projects
    ) {
      return res.status(403).json({ message: "Project limit reached" });
    }

    await pool.query(
      `INSERT INTO projects (tenant_id, name, description, created_by)
       VALUES ($1, $2, $3, $4)`,
      [user.tenantId, name, description, user.userId]
    );

    res.status(201).json({
      success: true,
      message: "Project created successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// LIST projects
exports.listProjects = async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const projects = await pool.query(
      `SELECT id, name, description, created_at
       FROM projects
       WHERE tenant_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [user.tenantId, limit, offset]
    );

    const total = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id = $1",
      [user.tenantId]
    );

    res.json({
      success: true,
      data: {
        projects: projects.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total.rows[0].count / limit),
          totalProjects: parseInt(total.rows[0].count),
          limit
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// UPDATE project
exports.updateProject = async (req, res) => {
  const { projectId } = req.params;
  const user = req.user;
  const { name, description } = req.body;

  try {
    const project = await pool.query(
      "SELECT tenant_id, created_by FROM projects WHERE id = $1",
      [projectId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { tenant_id, created_by } = project.rows[0];

    if (
      user.tenantId !== tenant_id ||
      (user.role !== "tenant_admin" && user.userId !== created_by)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      `UPDATE projects
       SET name = $1, description = $2
       WHERE id = $3`,
      [name, description, projectId]
    );

    res.json({ success: true, message: "Project updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// DELETE project
exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;
  const user = req.user;

  try {
    const project = await pool.query(
      "SELECT tenant_id, created_by FROM projects WHERE id = $1",
      [projectId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { tenant_id, created_by } = project.rows[0];

    if (
      user.tenantId !== tenant_id ||
      (user.role !== "tenant_admin" && user.userId !== created_by)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query("DELETE FROM tasks WHERE project_id = $1", [projectId]);
    await pool.query("DELETE FROM projects WHERE id = $1", [projectId]);

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
