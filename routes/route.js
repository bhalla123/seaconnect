const express = require("express");
 var router = express.Router();
 var User = require("../models/user");
passport = require('passport');
require('../helpers/passport')(passport);
const passportJWT = passport.authenticate('jwt', { session: false });
const { validateBody, validateQuery, validateFile, schemas } = require('../helpers/apiValidationHelper');
const multer = require('multer');
var path = require('path');
var app = express();

var vaultFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd() + '/public/profile/' }`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var vaultUploads = multer({storage : vaultFileStorage })// file data uploading path vault files

// importing controller
const userController = require('../controllers/userController');

//signIn
router.route('/api/login')
	.post(userController.login);

//user ->signup
router.route('/api/signup')
	.post(vaultUploads.single('profile_image'),validateBody(schemas.createUserSchema), userController.signUp);

//Get profile
router.route('/api/profile/detail/:id')
	.get(userController.getProfileDetail);

//update profile
router.route('/api/update/profile')
	.post(validateBody(schemas.updateProfileSchema), userController.updateProfile);

//update profile image
router.route('/api/update/profile/image')
	.post(vaultUploads.single('profile_image'), userController.updateProfileImage);


module.exports = router;