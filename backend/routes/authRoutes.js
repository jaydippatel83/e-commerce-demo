const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, verifyOTP} = require("../controllers/authController");
const { admin, protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, admin, getUsers);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/user/:id", protect, getUserProfile);
router.post("/verify-otp", protect, verifyOTP);

module.exports = router;