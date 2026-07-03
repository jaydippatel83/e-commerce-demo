const User = require("../model/user");
const Order = require("../model/order");
const Product = require("../model/product");

const getAdminStates = async () => {
  const usersCount = await User.countDocuments({});
  const ordersCount = await Order.countDocuments({});
  const productsCount = await Product.countDocuments({}); 
  const orders = await Order.find({});
  const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0); 

  return {
    users: usersCount,
    orders: ordersCount,
    products: productsCount,
    totalSales: totalSales,
  };
};

const getAnalytics = async (req, res) => {
  try {
    const adminStates = await getAdminStates(); 
    res.json(adminStates);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
}; 

module.exports = { getAnalytics };