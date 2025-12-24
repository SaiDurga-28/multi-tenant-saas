const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createUser,
  listUsers
} = require("../controllers/user.controller");

router.post("/:tenantId/users", authMiddleware, createUser);
router.get("/:tenantId/users", authMiddleware, listUsers);

module.exports = router;
