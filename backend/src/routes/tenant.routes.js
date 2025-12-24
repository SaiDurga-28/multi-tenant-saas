const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getTenant,
  updateTenant
} = require("../controllers/tenant.controller");

router.get("/:tenantId", authMiddleware, getTenant);
router.put("/:tenantId", authMiddleware, updateTenant);

module.exports = router;
