const Order = require("../model/order");
const Cart = require("../model/cart");
const Product = require("../model/product");

// Get all orders
module.exports.getAllOrders = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Order.find()
    .select("-_id")
    .limit(limit)
    .sort({ id: sort })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch orders",
        error: err.message,
      });
    });
};

// Get orders by user ID
module.exports.getOrdersByUserId = (req, res) => {
  const userId = req.params.userid;

  Order.find({ userId })
    .select("-_id")
    .sort({ createdAt: -1 })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch user orders",
        error: err.message,
      });
    });
};

// Get a single order by ID
module.exports.getOrderById = (req, res) => {
  const id = req.params.id;

  Order.findOne({ id })
    .select("-_id")
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }
      res.json(order);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch order",
        error: err.message,
      });
    });
};

// Update an order's status
module.exports.updateOrderStatus = (req, res) => {
  const id = req.params.id;
  const { status, paymentStatus } = req.body;

  const updateData = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  updateData.updatedAt = new Date();

  Order.findOneAndUpdate({ id }, updateData, { new: true })
    .select("-_id")
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }
      res.json(order);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Failed to update order",
        error: err.message,
      });
    });
};

// Delete an order
module.exports.deleteOrder = (req, res) => {
  const id = req.params.id;

  Order.findOneAndDelete({ id })
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          status: "error",
          message: "Order not found",
        });
      }
      res.json({
        status: "success",
        message: "Order deleted successfully",
        deletedOrder: order,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Failed to delete order",
        error: err.message,
      });
    });
};
