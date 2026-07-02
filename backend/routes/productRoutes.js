const express = require("express");
const { admin, protect } = require("../middleware/authMiddleware");
const router = express.Router();

 
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id").get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;


