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
    let cartCount = 0;
    Cart.find()
      .countDocuments(function (err, count) {
        cartCount = count;
      })
      .then(() => {
        const cart = new Cart({
          id: cartCount + 1,
          userId: req.body.userId,
          date: req.body.date || new Date(),
          products: req.body.products,
        });
        cart
          .save()
          .then((cart) => res.json(cart))
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              status: "error",
              message: "Failed to save cart to database",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Error counting carts",
          error: err.message,
        });
      });
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

    // Find the cart
    const cart = await Cart.findOne({ id: cartId }).select(
      "-_id -products._id"
    );

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found",
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

    // Count existing orders to generate a new ID
    const orderCount = await Order.countDocuments();

    // Create a new order
    const order = new Order({
      id: orderCount + 1,
      userId: cart.userId,
      cartId: cart.id,
      products: detailedProducts,
      totalAmount,
      shippingAddress: shippingAddress || {
        address: "Default Address",
        city: "Default City",
        postalCode: "12345",
        country: "Default Country",
      },
      paymentMethod: paymentMethod || "Cash on Delivery",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the order
    const savedOrder = await order.save();

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
