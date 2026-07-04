// One-off backfill: give existing products per-size stock (variants).
// Idempotent — only touches products that have no variants yet.
// Run:  node scripts/backfillSizes.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../model/product");

dotenv.config();

const ADULT_SIZES = ["S", "M", "L", "XL"];
const KIDS_SIZES = ["2-3Y", "4-5Y", "6-7Y", "8-9Y"];
// Products that are accessories keep no size.
const ACCESSORY_RE = /cap|hat|scarf|belt|sock|sandal|bag|sunglass|glove|watch|\btie\b|beanie|wallet|jewel|necklace|bracelet/i;

// Spread a total stock number across N sizes as evenly as possible.
const splitStock = (total, n) => {
  const base = Math.floor(total / n);
  const rem = total % n;
  return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0));
};

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Backfilling sizes…");

  const products = await Product.find({});
  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    if (p.variants && p.variants.length) continue; // already has sizes
    if (ACCESSORY_RE.test(p.name)) {
      skipped++;
      continue;
    }
    const sizes = p.category === "Kids" ? KIDS_SIZES : ADULT_SIZES;
    const stocks = splitStock(p.stock || 0, sizes.length);
    p.variants = sizes.map((s, i) => ({ size: s, stock: stocks[i] }));
    p.sizes = sizes;
    p.stock = stocks.reduce((a, b) => a + b, 0);
    await p.save();
    updated++;
  }

  console.log(`Done. Updated ${updated}, skipped ${skipped} accessories.`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
