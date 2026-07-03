const express = require("express");
const router = express.Router();
const { admin, protect } = require("../middleware/authMiddleware");
const { getAnalytics } = require("../controllers/analyticsController.js");

router.route("/").get(protect, admin, getAnalytics);

module.exports = router;