const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const paymentRoutes = require("./routes/paymentRoutes.js");

connectDB();
dotenv.config();

const app = express();
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization'],
  origin: ['http://localhost:3000',"*"], // Replace with your frontend URL
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/payment`, paymentRoutes);
// app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

app.get(`${API_PREFIX}/health`, (req, res) => {
  res.send("Hello World!");
});

// In production, serve the built React app and let client-side routing handle
// any non-API path (SPA fallback). Uses a middleware (not app.get("*")) because
// Express 5's path-to-regexp rejects a bare "*" wildcard.
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(buildPath));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(buildPath, "index.html"));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});