const express = require("express");
const { authenticate, authorizeRoles } = require("../middlewares/authMiddleware");
const { createUser, getAllUsers } = require("../controllers/userController");

const router = express.Router();

// ✅ Protected Route: Create User (Admin Only)
router.post("/register", authenticate, authorizeRoles(["admin"]), createUser);

// ✅ Protected Route: Get Users (Admin can see all, Users can see only themselves)
router.get("/", authenticate, authorizeRoles(["admin", "user"]), getAllUsers);

module.exports = router;
