const Product = require("../model/product");

module.exports.getAllProducts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
  const id = req.params.id;

  Product.findOne({
    id,
  })
    .select(["-_id"])
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductCategories = (req, res) => {
  Product.distinct("category")
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
  const category = req.params.category;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find({
    category,
  })
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.addProduct = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let productCount = 0;
    Product.find()
      .countDocuments(function (err, count) {
        productCount = count;
      })
      .then(() => {
        const product = new Product({
          id: productCount + 1,
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          image: req.body.image,
          category: req.body.category,
          rating: {
            rate: req.body.rating?.rate || 0,
            count: req.body.rating?.count || 0,
          },
        });
        product
          .save()
          .then((product) => res.json(product))
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              status: "error",
              message: "Failed to save product to database",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Error counting products",
          error: err.message,
        });
      });
  }
};

module.exports.editProduct = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    const id = parseInt(req.params.id);
    const updateData = {
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      rating: {
        rate: req.body.rating?.rate || 0,
        count: req.body.rating?.count || 0,
      },
    };

    Product.findOneAndUpdate({ id: id }, updateData, { new: true })
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            status: "error",
            message: "Product not found",
          });
        }
        res.json(product);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Failed to update product",
          error: err.message,
        });
      });
  }
};

module.exports.deleteProduct = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    const id = parseInt(req.params.id);

    Product.findOneAndDelete({ id: id })
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            status: "error",
            message: "Product not found",
          });
        }
        res.json({
          status: "success",
          message: "Product deleted successfully",
          deletedProduct: product,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Failed to delete product",
          error: err.message,
        });
      });
  }
};
