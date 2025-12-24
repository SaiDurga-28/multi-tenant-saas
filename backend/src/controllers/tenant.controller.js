const pool = require("../config/db");

// GET tenant details
exports.getTenant = async (req, res) => {
  const { tenantId } = req.params;
  const user = req.user;

  if (user.role !== "super_admin" && user.tenantId !== tenantId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, subdomain, status, subscription_plan, max_users, max_projects FROM tenants WHERE id = $1",
      [tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE tenant
exports.updateTenant = async (req, res) => {
  const { tenantId } = req.params;
  const user = req.user;

  if (user.role !== "super_admin" && user.tenantId !== tenantId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const { name } = req.body;

  try {
    await pool.query(
      "UPDATE tenants SET name = $1, updated_at = NOW() WHERE id = $2",
      [name, tenantId]
    );

    res.json({ success: true, message: "Tenant updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// LIST all tenants (super admin only)
exports.listTenants = async (req, res) => {
  const user = req.user;

  if (user.role !== "super_admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const tenants = await pool.query(
      `SELECT id, name, subdomain, status, subscription_plan, created_at
       FROM tenants
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const total = await pool.query("SELECT COUNT(*) FROM tenants");

    res.json({
      success: true,
      data: {
        tenants: tenants.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total.rows[0].count / limit),
          totalTenants: parseInt(total.rows[0].count),
          limit
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
