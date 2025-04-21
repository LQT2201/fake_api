const User = require("../model/user");

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  User.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
  const id = req.params.id;

  User.findOne({
    id,
  })
    .select(["-_id"])
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
};

module.exports.addUser = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let userCount = 0;
    User.find()
      .countDocuments(function (err, count) {
        userCount = count;
      })
      .then(() => {
        const user = new User({
          id: userCount + 1,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          name: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
          },
          address: {
            city: req.body.address.city,
            street: req.body.address.street,
            number: req.body.number,
            zipcode: req.body.zipcode,
            geolocation: {
              lat: req.body.address.geolocation.lat,
              long: req.body.address.geolocation.long,
            },
          },
          phone: req.body.phone,
        });
        user
          .save()
          .then((user) => res.json(user))
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              status: "error",
              message: "Failed to save user to database",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Error counting users",
          error: err.message,
        });
      });
  }
};

module.exports.editUser = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    const id = parseInt(req.params.id);
    const updateData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      name: {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      },
      address: {
        city: req.body.address.city,
        street: req.body.address.street,
        number: req.body.number,
        zipcode: req.body.zipcode,
        geolocation: {
          lat: req.body.address.geolocation.lat,
          long: req.body.address.geolocation.long,
        },
      },
      phone: req.body.phone,
    };

    User.findOneAndUpdate({ id: id }, updateData, { new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: "error",
            message: "User not found",
          });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Failed to update user",
          error: err.message,
        });
      });
  }
};

module.exports.deleteUser = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "user id should be provided",
    });
  } else {
    const id = parseInt(req.params.id);

    User.findOneAndDelete({ id: id })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            status: "error",
            message: "User not found",
          });
        }
        res.json({
          status: "success",
          message: "User deleted successfully",
          deletedUser: user,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          status: "error",
          message: "Failed to delete user",
          error: err.message,
        });
      });
  }
};
