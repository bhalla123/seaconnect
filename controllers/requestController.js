var mongoose = require('mongoose');
var User = require("../models/user");
var Interaction = require("../models/interactions");
var UserInteraction = require("../models/userInteractions");
var Connection = require("../models/connections");
const responseHelper = require('../helpers/responseHelper');
const fs = require('fs');

module.exports = {

  sendRequest: async(req, res) => {
    try{
          data =  {
            "authorized_id": req.user.id,
            "to_user_id":req.body.to_user_id,
            "status":"open"
          }

        var con = await Connection.create(data);

        return responseHelper.post(res, con, 'Request sent successfully');
    }catch(err){
      return responseHelper.onError(res, err, 'Error while sending status request');
    }
  },

  updateReceievdConnection: async(req, res) => {
    try{
          
        console.log(req.user.id);
        //get connection request
        var matchStats = await Connection.findOneAndUpdate({"_id": mongoose.Types.ObjectId(req.body.connection_id), 
                                    "to_user_id": mongoose.Types.ObjectId(req.user.id) },
                                     { $set: { "status": req.body.status }, 
                                   },{ new: true }).lean();

        return responseHelper.post(res, matchStats, 'Status updated successfully');
    }catch(err){
      return responseHelper.onError(res, err, 'Error updating status');
    }
  },

  receivedConnectionList: async(req, res) => {
    try{

        var receiverId = req.user.id;

        //get connection request
        let senderInfo = await Connection.aggregate([
         {
              $match: {
                  to_user_id: mongoose.Types.ObjectId(receiverId),
                  status: "open"
              }
          },
          {
              $lookup: {
                  localField: "authorized_id",
                  foreignField: "_id",
                  from: "users",
                  as: "senderDetail"
              }
          }  ,
          { $unwind : '$senderDetail' }      
      ]);

      if(senderInfo.length > 0){
        return responseHelper.post(res, senderInfo, "Received request list");
      }else{
        return responseHelper.onError(res, {}, 'You don not have any interest request yet');
      }
      
    }catch(err){
      return responseHelper.onError(res, err, 'Error while getting request');
    }
  }
}



