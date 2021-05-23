var mongoose = require('mongoose');
var User = require("../models/user");
var Interaction = require("../models/interactions");
var UserInteraction = require("../models/userInteractions");
var Review = require("../models/reviews");
var ReviewedBy = require("../models/reviwedby");
var Connection = require("../models/connections");
var Notification = require("../models/notifications");
const responseHelper = require('../helpers/responseHelper');
const fs = require('fs');
var PushDevice = require("../models/pushdevice");

var fcm = require('fcm-notification');
var FCM = new fcm('/var/www/html/seaconnect/siaconnect.json');

module.exports = {

  sendRequest: async(req, res) => {
    try{
          var loginUser = req.user.id;

          var userName = await User.findOne({"_id":loginUser}, {user_name:1}).lean();
         
          data =  {
            "authorized_id": req.user.id,
            "to_user_id":req.body.to_user_id,
            "status":"open"
          }

          var con = await Connection.create(data);

        //Notification
        {
          notification_data =  {
            "to_user_id":req.body.to_user_id,
            "authorized_id":req.user.id,
            "type":"ConnectionRequestSent",
            "title":"Connection Request Sent",
            "message": userName.user_name + " sent you connection request"
          }

          await Notification.create(notification_data);

          var pushToken = await PushDevice.findOne({
                user_id: mongoose.Types.ObjectId(req.body.to_user_id),
            });

          if(token){
            var token = pushToken.token;

            var message = {
              notification :{
                title: "Connection Request Sent",
                body: username.user_name + " send you connection request",
              },

              android: {
                ttl: 3600 * 1000,
                notification:{
                  icon: 'stock_ticker_update',
                  color: '#f45342',
                },
              },

              apns: {
                payload: {
                  aps: {
                    badge:42,
                    sound : "default",
                    type:"ConnectionRequestSent"
                  },
                },
              },

              token : token
            };

            FCM.send(message, function(err,response){
              if(err){
                console.log("Error found", err);
              }else{
                console.log("response here", response);
              }
            })
          }          
        }

      return responseHelper.post(res, con, 'Request sent successfully');
    }catch(err){
      console.log(err);
      return responseHelper.onError(res, (err), 'Error while sending status request');
    }
  },

  updateReceievdConnection: async(req, res) => {
    try{
        //get connection request
        var matchStats = await Connection.findOneAndUpdate({"_id": mongoose.Types.ObjectId(req.body.connection_id), 
                                    "to_user_id": mongoose.Types.ObjectId(req.user.id) },
                                     { $set: { "status": req.body.status }, 
                                   },{ new: true }).lean();

        if(req.body.status == "accepted"){
          loginUser = req.user.id;

          userName = await User.findOne({"_id": loginUser}, {user_name:1}).lean();
          
          data =  {
            "to_user_id":matchStats.authorized_id,
            "authorized_id":req.user.id,
            "type":"ConnectionRequestAccepted",
            "title":"Connection Request Accepted",
            "message": userName.user_name + " accepted yor connection request"
          }

          await Notification.create(data);

          var pushToken = await PushDevice.findOne({
                user_id: mongoose.Types.ObjectId(matchStats.authorized_id),
            });

          if(token){
            var token = pushToken.token;

            var message = {
              notification :{
                title : "Connection Request Accepted",
                body: userName.user_name + " accepted yor connection request",
              },

              android: {
                ttl: 3600 * 1000,
                notification:{
                  icon: 'stock_ticker_update',
                  color: '#f45342'
                },
              },

              apns: {
                payload: {
                  aps: {
                    badge:42,
                    sound : "default",
                    type:"ConnectionRequestAccepted",
                  },
                },
              },

              token : token
            };

            FCM.send(message, function(err,response){
              if(err){
                console.log("Error found", err);
              }else{
                console.log("response here", response);
              }
            })
          }
        }

        return responseHelper.post(res, matchStats, 'Status updated successfully');
    }catch(err){
      console.log(err);
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
        return responseHelper.successWithoutData(res, 'You don not have any interest request yet');
      }
      
    }catch(err){
      return responseHelper.onError(res, err, 'Error while getting request');
    }
  },

  //login users
  getRequestByStatus:async(req, res) => {
    try{

        var senderId = req.user.id;

        if(req.body.status != "notReviewed"){

          //get connection request
          let userDetail = await Connection.aggregate([
            {
                $match: {
                    authorized_id: mongoose.Types.ObjectId(senderId),
                    status: req.body.status
                }
            },
            {
                $lookup: {
                    localField: "to_user_id",
                    foreignField: "_id",
                    from: "users",
                    as: "userDetail"
                }
            },
            { $unwind : '$userDetail' }      
          ]);

          //get connection request
          let userDetails = await Connection.aggregate([
           {
                $match: {
                    to_user_id: mongoose.Types.ObjectId(senderId),
                    status: req.body.status
                }
            },
            {
                $lookup: {
                    localField: "authorized_id",
                    foreignField: "_id",
                    from: "users",
                    as: "userDetail"
                }
            },
            { $unwind : '$userDetail' }      
          ]);
        
          var af =  userDetail.concat(userDetails);

          if(af.length > 0){
            return responseHelper.post(res, (af), "Received request list");
          }else{
            return responseHelper.successWithoutData(res, 'No record found');
          }
      }else{

          var alreadyReviwedId = await ReviewedBy.find({"user_id": mongoose.Types.ObjectId(req.user.id)}).select(['connection_id']);

          var objectIdArray = alreadyReviwedId.map(s => mongoose.Types.ObjectId(s.connection_id));

              //get connection request
              let userDetail = await Connection.aggregate([
              {
                  $match: {
                      authorized_id: mongoose.Types.ObjectId(senderId),
                      _id: { $nin: objectIdArray},
                      is_reviwed: false,
                      status: "accepted"
                  }
              },
              {
                  $lookup: {
                      localField: "to_user_id",
                      foreignField: "_id",
                      from: "users",
                      as: "userDetail"
                  }
              },
              { $unwind : '$userDetail' }      
            ]); 
            
            //get connection request
              let userDetails = await Connection.aggregate([
               {
                    $match: {
                        to_user_id: mongoose.Types.ObjectId(senderId),
                        _id: { $nin: objectIdArray},
                        is_reviwed: false,
                        status: "accepted"
                    }
                },
                {
                    $lookup: {
                        localField: "authorized_id",
                        foreignField: "_id",
                        from: "users",
                        as: "userDetail"
                    }
                },
                { $unwind : '$userDetail' }      
              ]);

              var af =  userDetail.concat(userDetails);


        if(af.length > 0){
            return responseHelper.post(res, (af), "Not reviwed user's list");
          }else{
            return responseHelper.successWithoutData(res, 'No record found');
          }
      }
    }catch(err){
      console.log(err);
      return responseHelper.onError(res, err, 'Error while getting request');
    }
  }
}




