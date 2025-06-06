const User = require("../model/user");
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    User.findOne({
      username: username,
      password: password,
    })
      .then((user) => {
        if (user) {
          res.json({
            token: jwt.sign({ user: username, _id: user.id }, "secret_key"),
          });
        } else {
          res.status(401);
          res.send("username or password is incorrect");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          status: "error",
          message: "Login failed",
          error: err.message,
        });
      });
  } else {
    res.status(400).json({
      status: "error",
      message: "Username and password are required",
    });
  }
};
