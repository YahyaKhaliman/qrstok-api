const usersModel = require("../models/usersModel");

const register = async (req, res) => {
  try {
    const { username, password, passwordConfirm } = req.body;

    if (password !== passwordConfirm) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const newUser = await usersModel.addUser(username, password);

    return res.status(201).json({
      message: "Register Success",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Register Error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Menangani login
    const user = await usersModel.loginUser(username, password);

    return res.status(200).json({
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Login Error",
      error: error.message, // Kirimkan pesan kesalahan yang tepat
    });
  }
};

module.exports = {
  register,
  login,
};
