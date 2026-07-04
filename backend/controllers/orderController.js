const order = require("../model/order"); 
const User = require("../model/user");
const sendEmail = require("../utils/utils");
 
const buildOrderEmail = (user, newOrder) => {
    const orderDate = new Date(newOrder.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const itemLines = newOrder.orderItems
        .map(
            (item, i) =>
                `  ${i + 1}. ${item.name}  x${item.qty}  -  $${(item.price * item.qty).toFixed(2)}  ($${item.price.toFixed(2)} each)`
        )
        .join("\n");

    const addr = newOrder.shippingAddress;

    return `Dear ${user.name},

Thank you for your order! Your order has been placed successfully.

------------------------------------------------------------
ORDER SUMMARY
------------------------------------------------------------
Order ID     : ${newOrder._id}
Order Date   : ${orderDate}
Status       : ${newOrder.status}
Payment ID   : ${newOrder.paymentId}

ITEMS
${itemLines}

------------------------------------------------------------
Total Amount : $${newOrder.totalAmount.toFixed(2)}
------------------------------------------------------------

SHIPPING ADDRESS
${addr.fullName}
${addr.street}
${addr.city}, ${addr.postalCode}
${addr.country}

------------------------------------------------------------

We'll notify you once your order ships. If you have any questions,
just reply to this email.

Thank you for shopping with us!
E-commerce Team`;
};

const createOrder = async (req, res) => {
    const { orderItems, totalAmount, shippingAddress, paymentId } = req.body;
    try {
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items provided" });
        }

        const existingUser = await User.findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const newOrder = new order({
            user: req.user.id,
            orderItems,
            totalAmount,
            shippingAddress,
            paymentId,
        });
        await newOrder.save();

        // Send email notification to the user
        const msg = buildOrderEmail(existingUser, newOrder);
        try {
            await sendEmail(existingUser.email, "Order Confirmation - Your order has been placed", msg);
        } catch (emailError) {
            console.error("Failed to send order confirmation email:", emailError);
        }

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("createOrder error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const myOrders = await order.find({ user: req.user.id }).populate("user", "name email");
        res.status(200).json(myOrders);
    } catch (error) {
        console.error("getMyOrders error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const getOrders = async (req, res) => {
    try {
        let orders;
        if (req.user.role === "admin") {
            orders = await order.find().populate("user", "name email");
        } else {
            orders = await order.find({ user: req.user.id }).populate("user", "name email");
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error("getOrders error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const existingOrder = await order.findById(req.params.id).populate("user", "name email");
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (req.user.role !== "admin" && existingOrder.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to view this order" });
        }
        res.status(200).json(existingOrder);
    } catch (error) {
        console.error("getOrderById error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateOrder = async (req, res) => {
    try {
        const existingOrder = await order.findById(req.params.id);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        existingOrder.status = req.body.status || existingOrder.status;
        await existingOrder.save();
        res.status(200).json(existingOrder);
    } catch (error) {
        console.error("updateOrder error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const existingOrder = await order.findByIdAndDelete(req.params.id);
        if (!existingOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("deleteOrder error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createOrder, getOrders,getMyOrders, getOrderById, updateOrder, deleteOrder };