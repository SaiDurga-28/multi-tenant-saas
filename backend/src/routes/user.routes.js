const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createUser } = require("../controllers/user.controller");

router.post("/:tenantId/users", authMiddleware, createUser);

module.exports = router;
