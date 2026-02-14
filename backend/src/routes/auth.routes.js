const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);

router.post("/register-tenant", (req, res) => {
  res.status(201).json({
    success: true,
    message: "Tenant registered successfully"
  });
});

module.exports = router;
