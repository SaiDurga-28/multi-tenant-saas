const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  const { tenantId } = req.params;
  const { email, password, fullName, role = "user" } = req.body;
  const currentUser = req.user;

  // Only tenant_admin can create users
  if (currentUser.role !== "tenant_admin" || currentUser.tenantId !== tenantId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // Check subscription user limit
    const tenantResult = await pool.query(
      "SELECT max_users FROM tenants WHERE id = $1",
      [tenantId]
    );

    const maxUsers = tenantResult.rows[0].max_users;

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    if (parseInt(countResult.rows[0].count) >= maxUsers) {
      return res.status(403).json({ message: "User limit reached" });
    }

    // Check email uniqueness per tenant
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE tenant_id = $1 AND email = $2",
      [tenantId, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role, tenant_id, created_at`,
      [tenantId, email, hashedPassword, fullName, role]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.listUsers = async (req, res) => {
  const { tenantId } = req.params;
  const currentUser = req.user;

  // Tenant isolation
  if (currentUser.role !== "super_admin" && currentUser.tenantId !== tenantId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const search = req.query.search || "";
  const role = req.query.role;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;

  let query = `
    SELECT id, email, full_name, role, is_active, created_at
    FROM users
    WHERE tenant_id = $1
      AND (email ILIKE $2 OR full_name ILIKE $2)
  `;

  const params = [tenantId, `%${search}%`];

  if (role) {
    query += ` AND role = $3`;
    params.push(role);
  }

  query += ` ORDER BY created_at DESC LIMIT $4 OFFSET $5`;

  try {
    const users = await pool.query(query, [
      ...params,
      limit,
      offset
    ]);

    const total = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id = $1",
      [tenantId]
    );

    res.json({
      success: true,
      data: {
        users: users.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total.rows[0].count / limit),
          totalUsers: parseInt(total.rows[0].count),
          limit
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
