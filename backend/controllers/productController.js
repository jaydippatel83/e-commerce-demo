const Product = require("../model/product");
const cloudinary = require("../config/cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Normalize sizes coming from multipart form-data.
// Accepts a real array, a JSON string, or a comma-separated string.
const parseSizes = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.map((s) => String(s).trim()).filter(Boolean);
    if (typeof raw === "string") {
        const trimmed = raw.trim();
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
        } catch (_) {
            // not JSON — fall through to CSV
        }
        return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
};

// Normalize variants (per-size stock). Accepts a JSON string or an array of
// { size, stock }. Returns a clean array with numeric stock.
const parseVariants = (raw) => {
    let value = raw;
    if (typeof raw === "string") {
        try {
            value = JSON.parse(raw);
        } catch (_) {
            return [];
        }
    }
    if (!Array.isArray(value)) return [];
    return value
        .filter((v) => v && v.size)
        .map((v) => ({
            size: String(v.size).trim(),
            stock: Math.max(0, parseInt(v.stock, 10) || 0),
        }))
        .filter((v) => v.size);
};

// Apply variants to a product doc: derive `sizes` and total `stock`.
const applyVariants = (product, variants, fallbackStock) => {
    if (variants && variants.length) {
        product.variants = variants;
        product.sizes = variants.map((v) => v.size);
        product.stock = variants.reduce((sum, v) => sum + v.stock, 0);
    } else if (fallbackStock !== undefined) {
        product.stock = fallbackStock;
    }
};

const getProducts = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);
        const skip = (page - 1) * limit;

        // Build a filter from optional query params
        const filter = {};
        if (req.query.category && req.query.category !== "all") {
            filter.category = new RegExp(`^${req.query.category}$`, "i");
        }
        if (req.query.keyword) {
            filter.name = new RegExp(req.query.keyword, "i");
        }
        if (req.query.size) {
            filter.sizes = req.query.size;
        }

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            products,
            page,
            pages: Math.ceil(total / limit) || 1,
            total,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, sizes, variants } = req.body;
        let imageUrl = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });
            imageUrl = result.secure_url;
        }
        const parsedVariants = parseVariants(variants);
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            imageUrl,
            stock: stock || 0,
            sizes: parseSizes(sizes),
        });
        // per-size stock takes precedence: derives sizes + total stock
        applyVariants(newProduct, parsedVariants, stock);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, sizes, variants } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        if (sizes !== undefined) product.sizes = parseSizes(sizes);
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products",
            });
            product.imageUrl = result.secure_url;
        }
        if (variants !== undefined) {
            // per-size stock present → derives sizes + total stock
            applyVariants(product, parseVariants(variants), stock || product.stock);
        } else if (stock !== undefined) {
            product.stock = stock || product.stock;
        }
        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (deletedProduct) {
            res.status(200).json({ message: "Product deleted successfully" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Add a review to a product (one per user). Recomputes rating + numReviews.
const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating) {
            return res.status(400).json({ message: "Rating is required" });
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user.id
        );
        if (alreadyReviewed) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        product.reviews.push({
            user: req.user.id,
            name: req.user.name,
            rating: Number(rating),
            comment: comment || "",
        });
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: "Review added", reviews: product.reviews, rating: product.rating, numReviews: product.numReviews });
    } catch (error) {
        console.error("createProductReview error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};