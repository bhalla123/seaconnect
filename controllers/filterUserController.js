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

      const interactionId = req.body.interactions;

      var interactions = req.body;

      //del already exist interactions
      await UserInteraction.deleteMany({user_id: req.user.id});

      //insert new
      var insert = await interactions.interactions.map(item => {

                        data.push({"user_id":req.user.id,
                        "interaction_id":item })
                        });

      await UserInteraction.insertMany(data);

      /*var users = await  UserInteraction.find({
        interaction_id: { $in: interactionId}
      });*/

      let objectIdArray = interactionId.map(s => mongoose.Types.ObjectId(s));

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




