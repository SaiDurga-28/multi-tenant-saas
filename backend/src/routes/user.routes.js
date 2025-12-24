const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  createUser,
  listUsers,
  updateUser,
  deleteUser
} = require("../controllers/user.controller");

router.post("/:tenantId/users", authMiddleware, createUser);
router.get("/:tenantId/users", authMiddleware, listUsers);

router.put("/users/:userId", authMiddleware, updateUser);
router.delete("/users/:userId", authMiddleware, deleteUser);

module.exports = router;
