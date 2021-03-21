var mongoose = require('mongoose');
var User = require("../models/user");
var Interaction = require("../models/interactions");
var UserInteraction = require("../models/userInteractions");
const JWT = require('jsonwebtoken');
const responseHelper = require('../helpers/responseHelper');
let bcrypt = require("bcryptjs");
const fs = require('fs');

module.exports = {

  filterUsers: async(req, res) => {
    try{

      var data = [];

      if(req.body.latitude && req.body.longitude){
        var newUser = {
          latitude : req.body.latitude,
          longitude : req.body.longitude
        }

        var user = await User.findOneAndUpdate(
                    {_id: req.user.id }
                    ,newUser,
                    { new: true}
                ).lean();
      }

      var interactionId = req.body.interactions;


      //del already exist interactions
      await UserInteraction.deleteMany({user_id: req.user.id});

      if(interactionId.length < 1){
        var interactionId = await Interaction.find({}).select(['name']);

        var objectIdArray = interactionId.map(s => mongoose.Types.ObjectId(s._id));
        console.log("D", objectIdArray);
  
      }else{
        var objectIdArray = interactionId.map(s => mongoose.Types.ObjectId(s));
      }

      //insert new
      var insert = await interactionId.map(item => {

                        data.push({"user_id":req.user.id,
                        "interaction_id":item })
                        });

      await UserInteraction.insertMany(data);

      let playerInfo = await UserInteraction.aggregate([
         {
              $match: {
                  interaction_id: { $in: objectIdArray},
                  user_id: {$ne: mongoose.Types.ObjectId(req.user.id)}
              }
          },
        {
            $lookup: {
                localField: "user_id",
                foreignField: "_id",
                from: "users",
                as: "userDetail"
            }
        }  ,
        { $unwind : '$userDetail' }      
    ]);
      
      return responseHelper.post(res, playerInfo, 'Interaction List');

    }catch(err){
      return responseHelper.onError(res, err, 'Error while filtering users');
    }
  },

  getInteractionList: async(req, res) => {
    try{
        var interactions = await Interaction.find({});

        return responseHelper.post(res, interactions, 'Interaction List');
    }catch(err){
      return responseHelper.onError(res, err, 'Error while getting interaction list');
    }
  }
}




