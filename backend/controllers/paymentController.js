const Razorpay = require("razorpay");
const crypto = require("crypto");
dotenv = require("dotenv").config();

const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      // Razorpay requires an integer amount in the smallest currency unit
      // (paise). Round to avoid floating-point results like 12996.9999.
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: crypto.randomBytes(10).toString("hex"), // random receipt ID
    };

    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const processPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
};

module.exports = { createOrder, processPayment };