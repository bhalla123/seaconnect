const express = require("express"),
      router = express.Router(),
      User = require("../models/user");

// importing controller
const userController = require('../controllers/userController');

//user ->signup
router.post("/api/signup", userController.signUp);



module.exports = router;