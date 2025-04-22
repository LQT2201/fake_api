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
    // Create a new user with only the fields provided in the request
    const userData = {
      id: Date.now().toString(), // Generate unique ID based on timestamp
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      name: {},
      address: {},
    };

    // Add name fields if provided
    if (req.body.firstname) userData.name.firstname = req.body.firstname;
    if (req.body.lastname) userData.name.lastname = req.body.lastname;

    // Add phone if provided
    if (req.body.phone) userData.phone = req.body.phone;

    // Add address fields if provided
    if (req.body.address) {
      if (req.body.address.city) userData.address.city = req.body.address.city;
      if (req.body.address.street)
        userData.address.street = req.body.address.street;
      if (req.body.address.number)
        userData.address.number = req.body.address.number;
      if (req.body.address.zipcode)
        userData.address.zipcode = req.body.address.zipcode;

      // Add geolocation if provided
      if (req.body.address.geolocation) {
        userData.address.geolocation = {};
        if (req.body.address.geolocation.lat)
          userData.address.geolocation.lat = req.body.address.geolocation.lat;
        if (req.body.address.geolocation.long)
          userData.address.geolocation.long = req.body.address.geolocation.long;
      }
    }

    // Set default values for required fields
    if (!userData.name.firstname) userData.name.firstname = "";
    if (!userData.name.lastname) userData.name.lastname = "";
    if (!userData.address.city) userData.address.city = "";
    if (!userData.address.street) userData.address.street = "";
    if (!userData.address.number) userData.address.number = 0;
    if (!userData.address.zipcode) userData.address.zipcode = "";
    if (!userData.address.geolocation) {
      userData.address.geolocation = {
        lat: "0",
        long: "0",
      };
    }

    const user = new User(userData);

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

    // Create an updateData object that only includes fields present in the request
    const updateData = {};

    // Handle simple fields
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.username !== undefined)
      updateData.username = req.body.username;
    if (req.body.password !== undefined)
      updateData.password = req.body.password;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;

    // Handle nested name object
    if (req.body.firstname !== undefined || req.body.lastname !== undefined) {
      updateData.name = {};

      // Get current user data to preserve existing values if not updated
      User.findOne({ id })
        .then((currentUser) => {
          if (!currentUser) {
            return res.status(404).json({
              status: "error",
              message: "User not found",
            });
          }

          // Set name fields, using existing values if not provided
          updateData.name.firstname =
            req.body.firstname !== undefined
              ? req.body.firstname
              : currentUser.name.firstname;

          updateData.name.lastname =
            req.body.lastname !== undefined
              ? req.body.lastname
              : currentUser.name.lastname;

          // Handle address fields if provided
          if (req.body.address) {
            updateData.address = {};

            // Use existing values for fields not specified in the request
            if (req.body.address.city !== undefined)
              updateData.address.city = req.body.address.city;
            else if (currentUser.address)
              updateData.address.city = currentUser.address.city;

            if (req.body.address.street !== undefined)
              updateData.address.street = req.body.address.street;
            else if (currentUser.address)
              updateData.address.street = currentUser.address.street;

            if (req.body.address.number !== undefined)
              updateData.address.number = req.body.address.number;
            else if (currentUser.address)
              updateData.address.number = currentUser.address.number;

            if (req.body.address.zipcode !== undefined)
              updateData.address.zipcode = req.body.address.zipcode;
            else if (currentUser.address)
              updateData.address.zipcode = currentUser.address.zipcode;

            // Handle geolocation if provided
            if (req.body.address.geolocation) {
              updateData.address.geolocation = {};

              if (req.body.address.geolocation.lat !== undefined)
                updateData.address.geolocation.lat =
                  req.body.address.geolocation.lat;
              else if (currentUser.address && currentUser.address.geolocation)
                updateData.address.geolocation.lat =
                  currentUser.address.geolocation.lat;

              if (req.body.address.geolocation.long !== undefined)
                updateData.address.geolocation.long =
                  req.body.address.geolocation.long;
              else if (currentUser.address && currentUser.address.geolocation)
                updateData.address.geolocation.long =
                  currentUser.address.geolocation.long;
            } else if (currentUser.address && currentUser.address.geolocation) {
              // Copy existing geolocation if not provided in request
              updateData.address.geolocation = currentUser.address.geolocation;
            }
          }

          // Now perform the update with our carefully constructed object
          return User.findOneAndUpdate({ id }, updateData, { new: true });
        })
        .then((updatedUser) => {
          if (updatedUser) {
            res.json(updatedUser);
          }
          // If no user was found, we already sent a 404 response
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            status: "error",
            message: "Failed to update user",
            error: err.message,
          });
        });
    } else {
      // If name fields weren't provided, we can do a simpler update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No fields to update were provided",
        });
      }

      User.findOneAndUpdate({ id }, updateData, { new: true })
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
