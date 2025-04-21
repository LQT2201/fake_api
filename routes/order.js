const express = require("express");
const router = express.Router();
const order = require("../controller/order");

// Get all orders
router.get("/", order.getAllOrders);

// Get orders by user ID
router.get("/user/:userid", order.getOrdersByUserId);

// Get a single order by ID
router.get("/:id", order.getOrderById);

// Update an order's status
router.patch("/:id", order.updateOrderStatus);

// Delete an order
router.delete("/:id", order.deleteOrder);

module.exports = router;
