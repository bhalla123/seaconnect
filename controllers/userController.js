var mongoose = require('mongoose');
var User = require("../models/user");
var UserImages = require("../models/userImages");
var Rating = require("../models/ratings");
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
                interested_in : req.body.interested_in,
                mobile_number : req.body.mobile_number,
                age_range:req.body.age_range,
                email: req.body.email,
                looking_for:req.body.looking_for,
                bio:req.body.bio
            });

            // Match email
            const emailCheck = await User.findOne({
                email: req.body.email,
            });

            if(emailCheck){
              return responseHelper.onError(res, {}, 'Email already exist');
            }

            const usernameCheck = await User.findOne({
                user_name: req.body.user_name,
            });

            if(usernameCheck){
              return responseHelper.onError(res, {}, 'Username already exist');
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
              user_name: data.user_name,
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
                }, { access_token: access_token}).select({ "first_name": 1, "_id": 1, profile_image:1 , "user_name":1, "email":1})

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

            //Get rating
            {
               var loginUser = req.params.id;

                var rating = await Rating.aggregate([
                 {
                      $match: {
                        to_user_id: mongoose.Types.ObjectId(loginUser),
                      }
                  },
                  {
                      $lookup: {
                          localField: "authorized_id",
                          foreignField: "_id",
                          from: "users",
                          as: "raterDetail"
                      }
                  },
                  { $unwind : '$raterDetail' },
                  {
                    $group: {
                        _id: "$to_user_id",
                        avgRating: { "$avg": { "$ifNull": ["$rating",0 ] } },
                        raters: {
                            $push: {
                              user_name: { $ifNull: ["$raterDetail.user_name", null] },
                              rating: { $ifNull: ["$rating", null] },
                              bio: { $ifNull: ["$raterDetail.bio", null] }
                            }
                        },
                    },
                  },     
              ]);
            }

            var user_images = await UserImages.find({user_id: req.params.id});
            var user = await User.findById({ _id: req.params.id }, { userImages: user_images, rating: rating}).select({ "first_name": 1,  "_id": 1, profile_image:1 , "user_name":1, "email":1, "interested_in":1, "gender":1, "latitude":1,"longitude":1, "looking_for":1, "age_range":1,"looking_for":1,"dob":1,"mobile_number":1,"bio":1});

            return responseHelper.post(res, user, 'Profile detail fetched Successfully');
            
            
      }catch(err) {
        console.log(err);
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
                looking_for:req.body.looking_for,
                bio:req.body.bio
            };

            var UserId = data.id;

            // Match email
            const emailCheck = await User.findOne({
                email: req.body.email,
                _id: { $ne: UserId }
            });

            if(emailCheck){
              return responseHelper.onError(res, {}, 'Email already exist');
            }

            const usernameCheck = await User.findOne({
                user_name: req.body.user_name,
                _id: { $ne: UserId }
            });

            if(usernameCheck){
              return responseHelper.onError(res, {}, 'Username already exist');
            }
  
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
          return responseHelper.onError(res, err, 'Error while updating image');
      }
    },


    deleteImage: async(imagePath, next) => {
      fs.unlink(imagePath, (err) => {
        if (err) {
           console.log("Failed to delete image at delete profile");
           return next(err);
        }
    });
  },

  uploadUserImages: async(req, res) => {

    var files = req.files;
              console.log(files);

    var data = [];

     //insert new
      var insert = await files.map(item => {
                        data.push({"user_id":req.user.id,
                        "image_path":item.filename })
                        });

      var resp = await UserImages.insertMany(data);

    return responseHelper.get(res, resp,  'User images fetch successfully.');
  }
}




