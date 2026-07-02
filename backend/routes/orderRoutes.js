const express = require("express");
const router = express.Router();
const { admin, protect } = require("../middleware/authMiddleware");
const { createOrder, getOrders, getOrderById, updateOrder, deleteOrder, getMyOrders } = require("../controllers/orderController.js");

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);
router.route("/my-orders").get(protect, getMyOrders);
router.route("/:id/status").get(protect, getOrderById).put(protect, admin, updateOrder).delete(protect, admin, deleteOrder);

module.exports = router;    