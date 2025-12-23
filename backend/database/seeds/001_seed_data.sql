-- Seed tenant
INSERT INTO tenants (name, subdomain, subscription_plan, max_users, max_projects)
VALUES ('Demo Company', 'demo', 'basic', 5, 3);

-- Seed super admin (no tenant)
INSERT INTO users (email, password_hash, role)
VALUES ('admin@system.com', 'hashed_password', 'super_admin');

-- Seed tenant admin
INSERT INTO users (tenant_id, email, password_hash, role)
VALUES (1, 'admin@demo.com', 'hashed_password', 'tenant_admin');
