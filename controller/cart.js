const Cart = require("../model/cart");
const Product = require("../model/product");
const Order = require("../model/order");

module.exports.getAllCarts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  console.log(startDate, endDate);

  Cart.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .limit(limit)
    .sort({ id: sort })
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = (req, res) => {
  const userId = req.params.userid;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  console.log(startDate, endDate);
  Cart.find({
    userId,
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getSingleCart = (req, res) => {
  const id = req.params.id;
  Cart.findOne({
    id,
  })
    .select("-_id -products._id")
    .then((cart) => res.json(cart))
    .catch((err) => console.log(err));
};

module.exports.addCart = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    try {
      // Generate a unique cart ID
      const cartId = Date.now().toString();

      // Create a new cart with the generated ID
      const cart = new Cart({
        id: cartId,
        userId: req.body.userId,
        date: req.body.date || new Date(),
        products: req.body.products || [],
      });

      cart
        .save()
        .then((cart) => {
          console.log("New cart created with ID:", cartId);
          res.json(cart);
        })
        .catch((err) => {
          console.log("Error saving cart:", err);
          res.status(500).json({
            status: "error",
            message: "Failed to save cart to database",
            error: err.message,
          });
        });
    } catch (err) {
      console.log("Exception in addCart:", err);
      res.status(500).json({
        status: "error",
        message: "Error creating cart",
        error: err.message,
      });
    }
  }
};

module.exports.editCart = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    const id = parseInt(req.params.id);
    const updateData = {
      userId: req.body.userId,
      date: req.body.date,
      products: req.body.products,
    };

    Cart.findOneAndUpdate({ id: id }, updateData, { new: true })
      .then((cart) => {
        if (!cart) {
          return res.status(404).json({
            status: "error",
            message: "Cart not found",
          });
        }
        res.json(cart);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Failed to update cart",
          error: err.message,
        });
      });
  }
};

module.exports.deleteCart = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    const id = parseInt(req.params.id);

    Cart.findOneAndDelete({ id: id })
      .then((cart) => {
        if (!cart) {
          return res.status(404).json({
            status: "error",
            message: "Cart not found",
          });
        }
        res.json({
          status: "success",
          message: "Cart deleted successfully",
          deletedCart: cart,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Failed to delete cart",
          error: err.message,
        });
      });
  }
};

module.exports.checkout = async (req, res) => {
  try {
    const cartId = parseInt(req.params.id);
    const { shippingAddress, paymentMethod } = req.body;

    if (!cartId) {
      return res.status(400).json({
        status: "error",
        message: "Cart ID is required for checkout",
      });
    }

    // Find the cart
    const cart = await Cart.findOne({ id: cartId });

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
      });
    }

    // Check if cart has products
    if (!cart.products || cart.products.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Cannot checkout with empty cart",
      });
    }

    // Get detailed product information for each item in the cart
    const detailedProducts = [];
    let totalAmount = 0;

    // Process each product in the cart
    for (const item of cart.products) {
      const product = await Product.findOne({ id: item.productId });

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: `Product with ID ${item.productId} not found`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      detailedProducts.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        title: product.title,
        image: product.image,
      });
    }

    console.log(totalAmount, detailedProducts);

    // Create a new order
    const order = new Order({
      id: Date.now().toString(),
      userId: cart.userId,
      cartId: cart.id,
      products: detailedProducts,
      total: totalAmount,
      date: new Date(),
      status: "Processing",
      shippingAddress: shippingAddress || {
        address: "Default Address",
        city: "Default City",
        postalCode: "123456",
        country: "Default Country",
      },
      paymentMethod: paymentMethod || "Cash on Delivery",
      shippingFee: totalAmount > 100 ? 0 : 10, // Free shipping for orders over $100
    });

    // Save the order
    const savedOrder = await order.save();

    // Empty the cart after checkout
    cart.products = [];
    await cart.save();

    // Respond with the created order
    res.status(201).json({
      status: "success",
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process checkout",
      error: error.message,
    });
  }
};
