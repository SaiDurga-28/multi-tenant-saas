-- ===============================
-- TENANT
-- ===============================
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects)
VALUES (1, 'Demo Company', 'demo', 'active', 'pro', 25, 15);

-- ===============================
-- SUPER ADMIN
-- Email: superadmin@system.com
-- Password: Admin@123
-- ===============================
INSERT INTO users (id, tenant_id, email, password_hash, role, full_name)
VALUES (
  1,
  NULL,
  'superadmin@system.com',
  '$2b$10$Mnb.Zv15Sf3h7eTx78tiHOUA32uyF.qWeKmiA59gMlisM/Y4riu3C',
  'super_admin',
  'System Admin'
);

-- ===============================
-- TENANT ADMIN
-- Email: admin@demo.com
-- Password: Demo@123
-- ===============================
INSERT INTO users (id, tenant_id, email, password_hash, role, full_name)
VALUES (
  2,
  1,
  'admin@demo.com',
  '$2b$10$GQ6AGkPF3BdpWyI4l0GNaOER/YQ8tZH0ur7m.Tc3rg8uR2n1XvDHq',
  'tenant_admin',
  'Demo Admin'
);

-- ===============================
-- REGULAR USER
-- Email: user1@demo.com
-- Password: User@123
-- ===============================
INSERT INTO users (id, tenant_id, email, password_hash, role, full_name)
VALUES (
  3,
  1,
  'user1@demo.com',
  '$2b$10$rc8i4QEM3QpWZijeaqudf.QUqLEjzoCLoKnuruYPnT84niOpXc0Fi',
  'user',
  'Demo User'
);

-- ===============================
-- PROJECT
-- ===============================
INSERT INTO projects (id, tenant_id, name, description, status, created_by)
VALUES (
  1,
  1,
  'Demo Project',
  'Initial demo project',
  'active',
  2
);

-- ===============================
-- TASK
-- ===============================
INSERT INTO tasks (
  id,
  tenant_id,
  project_id,
  title,
  description,
  status,
  priority,
  assigned_to
)
VALUES (
  1,
  1,
  1,
  'Initial Task',
  'First demo task',
  'todo',
  'medium',
  3
);
