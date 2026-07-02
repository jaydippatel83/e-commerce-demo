const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, getUsers, verifyOTP} = require("../controllers/authController");
const { admin, protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
router.get("/user/:id", protect, getUserProfile);
router.post("/verify-otp", protect, verifyOTP);

module.exports = router;