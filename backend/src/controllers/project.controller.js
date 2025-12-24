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
