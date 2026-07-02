const express = require("express");
const router = express.Router(); 
const { createOrder, processPayment } = require("../controllers/paymentController.js");

router.post("/order", createOrder);
router.post("/verify", processPayment);

module.exports = router;