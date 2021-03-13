var mongoose = require('mongoose');
var User = require("../models/user");
const JWT = require('jsonwebtoken');
const helperFxn = require('../helpers/hashPasswords');
const responseHelper = require('../helpers/responseHelper');
let bcrypt = require("bcryptjs");
const uid = require('uid');
const fs = require('fs');


signtoken = user => {
  return JWT.sign({
    id: user._id
  }, "ASDCSFASD");
}


module.exports = {

    signUp : async function(req, res) {
      try {

            let hash = bcrypt.hashSync(req.body.password, 10);

            const newUser = new User({
                first_name : req.body.first_name,
                password:hash,
                user_name : req.body.user_name,
                gender : req.body.gender,
                dob : req.body.dob,
                interest_in : req.body.interest_in,
                mobile_number : req.body.mobile_number,
                age_range:req.body.age_range,
                email: req.body.email,
                looking_for:req.body.looking_for
            });

            // Match email
            const emailCheck = await User.findOne({
                email: req.body.email,
            });

            if(emailCheck){
              return responseHelper.onError(res, {}, 'Email already exist');
            }

            if(req.file){
              newUser.profile_image = req.file.filename
            }

            let newPassword = await helperFxn.generatePass(req.body.password);
        
            var user = await User.create(newUser);

            if(user){
                const access_token = await signtoken(user)
                var getUser = await User.findOne({
                    _id: user._id
                }, { access_token: access_token}).select(['first_name', 'profile_image','user_name', 'email', 'dob', 'mobile_number'])

                delete getUser.password;

                return responseHelper.post(res, getUser, 'User Registered');
            }else{
                return responseHelper.onError(res, err, 'Error while registering user');
            }
            
        } catch(err) {
            return responseHelper.onError(res, err, 'Error while registering user');
        }
    },
    
    // login
    login: async (req, res) => {
        try {
          const data = req.body;
          // Match email
          const user = await User.findOne({
              email: data.email,
          });


          if (user) {
            // Match password
            const isMatch = await bcrypt.compareSync(data.password, user.password);
            if (!isMatch) {
              return responseHelper.Error(res, {}, 'Invalid login details')
            }
            
            const access_token = signtoken(user._id)
            var getUser = await User.findOne({
                    _id: user._id
                }, { access_token: access_token}).select(['first_name', 'profile_image', 'user_name', 'email', 'dob', 'mobile_number'])

                delete getUser.password;
            return responseHelper.post(res, getUser, 'User Successfully logged in');
          } else {
            return responseHelper.Error(res, {}, 'Invalid login details')
          }

        } catch (err) {
          return responseHelper.onError(res, err, 'Error while logging In');
        }
      },

    getProfileDetail :async function(req, res) {
      try{

            var user = await User.findById({ _id: req.params.id });

            if(user){
              return responseHelper.post(res, user, 'Profile detail fetched Successfully');
            }else{
              return responseHelper.onError(res, {}, 'User does not exist');
            }
      }catch(err) {
        return responseHelper.onError(res, err, 'Error while getting profile');
      }
    },

    updateProfile: async(req, res) => {
      try{
          var data = req.body;
          
          var newUser = {
                first_name : req.body.first_name,
                user_name : req.body.user_name,
                gender : req.body.gender,
                dob : req.body.dob,
                interested_in : req.body.interested_in,
                mobile_number : req.body.mobile_number,
                age_range:req.body.age_range,
                email: req.body.email,
                looking_for:req.body.looking_for
            };
  
            if(data.password){
              newUser.password = bcrypt.hashSync(data.password, 10);
            }

          var user = await User.findOneAndUpdate(
                    {_id: data.id }
                    ,newUser,
                    { new: true}
                ).lean();

          return responseHelper.post(res, user, 'Profile updated successfully');
      }catch(err){
        return responseHelper.onError(res, err, 'Error while updating profile');
      }
    },

    updateProfileImage: async(req, res) => {
      try{

         var user = await User.findOne({ _id: req.body.id });

        let imageUrl;

        if(req.file) {
            imageUrl = req.file.filename;

            var filename = imageUrl;
            let previousImagePath = "/var/www/html/seaconnect/public/profile/" +user.profile_image;

            const imageExist = fs.existsSync(previousImagePath);

            if(imageExist) {
                fs.unlink(previousImagePath, (err) => {
                  if (err) {
                     console.log("Failed to delete image at delete profile");
                     return next(err);
                  }
              });
            }
            
        } 

        var user = await User.findOneAndUpdate(
                    {_id: user._id }
                    ,{profile_image: filename},
                    { new: true}
                ).lean();

        return responseHelper.post(res, user, 'Profile updated successfully');
      }catch(err){
          return responseHelper.onError(res, err, 'Error while registering user');
      }
    },


    deleteImage: async(imagePath, next) => {
      fs.unlink(imagePath, (err) => {
        if (err) {
           console.log("Failed to delete image at delete profile");
           return next(err);
        }
    });
  }
}




