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
const filterController = require('../controllers/filterUserController');
const requestController = require('../controllers/requestController');

//signIn
router.route('/api/login')
	.post(userController.login);

//user ->signup
router.route('/api/signup')
	.post(vaultUploads.single('profile_image'),validateBody(schemas.createUserSchema), userController.signUp);

//Get profile
router.route('/api/profile/detail/:id')
	.get(passportJWT, userController.getProfileDetail);

//update profile
router.route('/api/update/profile')
	.post(validateBody(schemas.updateProfileSchema), userController.updateProfile);

//update profile image
router.route('/api/update/profile/image')
	.post(vaultUploads.single('profile_image'), userController.updateProfileImage);

//filter user by interactions
router.route('/api/filter/users')
	.post(passportJWT, validateBody(schemas.filterInteractionSchema), filterController.filterUsers);

//filter user by interactions
router.route('/api/get/interaction/list')
	.get(passportJWT, filterController.getInteractionList);

//send conection request
router.route('/api/send/connection/request')
	.post(passportJWT, requestController.sendRequest);

//update status
router.route('/api/update/receievd/connection')
	.post(passportJWT, validateBody(schemas.connectionStatusSchema), requestController.updateReceievdConnection);

//get connection list
router.route('/api/get/received/connection/list')
	.get(passportJWT, requestController.receivedConnectionList);

//upload user images
router.route('/api/upload/user/images')
	.post(passportJWT, vaultUploads.array('user_images'), userController.uploadUserImages);


module.exports = router;