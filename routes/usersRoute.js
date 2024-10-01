const express = require("express");
const router = express.Router();
const UsersControllers = require("../controllers/usersController");

router.post("/register", UsersControllers.register);
router.post("/login_admin", UsersControllers.login);

module.exports = router;
