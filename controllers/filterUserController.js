var mongoose = require('mongoose');
var User = require("../models/user");
var Interaction = require("../models/interactions");
var UserInteraction = require("../models/userInteractions");
const JWT = require('jsonwebtoken');
const responseHelper = require('../helpers/responseHelper');
let bcrypt = require("bcryptjs");
const fs = require('fs');
var Connection = require("../models/connections");

module.exports = {

  filterUsers: async(req, res) => {
    try{

      var data = [];

      if(req.body.latitude && req.body.longitude){
        var lat = req.body.latitude;
        var lng = req.body.longitude;

        var newUser = {
          latitude : lat,
          longitude : lng,
          location: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          }
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
  
      }else{
        var objectIdArray = interactionId.map(s => mongoose.Types.ObjectId(s));
      }

      var userIds = await User.find(
              {
                "location": {
                  "$nearSphere": {
                    "$geometry": {
                      "type": "Point",
                      "coordinates": [ parseFloat(lng), parseFloat(lat) ],
                      "maxDistance":500, 
                      'distanceField' : 'distance', 
                       spherical: true
                    }
                  }
                }
              }).select('id');

      //already connected users
      var senderId =  req.user.id;
      let userDetail = await Connection.aggregate([
            {
                $match: {
                    authorized_id: mongoose.Types.ObjectId(senderId),
                    status: "accepted"
                }
            },
            { "$project": {"connected_user_id": "$to_user_id", to_user_id: 1}}      
          ]);

          //get connection request
          let userDetails = await Connection.aggregate([
                {"$match": {
                    to_user_id: mongoose.Types.ObjectId(senderId),
                    status: "accepted"
                }},
                { "$project": {"connected_user_id": "$authorized_id", authorized_id:1}}     
          ]);


          let userid = {
            "connected_user_id": senderId
          }

      var connectedUsers = userDetail.concat(userDetails).concat(userid);

      var alreadyConnectedUsers = [];

      await connectedUsers.map(item => {
                        alreadyConnectedUsers.push(""+item.connected_user_id+"")
                    });

      var nearUserIds = [];
      var users = await userIds.filter(function(el){
                        if(alreadyConnectedUsers.indexOf( el.id ) < 0){
                          nearUserIds.push(el._id)
                        }
                    });

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
                  user_id: { $in: nearUserIds },
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
      console.log(err);
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




