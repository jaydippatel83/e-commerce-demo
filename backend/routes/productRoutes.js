const express = require("express");
const { admin, protect } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const upload = multer({ dest: "uploads/" });


router.route("/").get(getProducts).post(protect, admin, upload.single("image"), createProduct);
router.route("/:id").get(getProductById).put(protect, admin, upload.single("image"), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;


