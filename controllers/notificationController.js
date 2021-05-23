var mongoose = require('mongoose');
var User = require("../models/user");
var Chat = require(".././chatModule/model/chat");
const responseHelper = require('../helpers/responseHelper');
const fs = require('fs');
var Notification = require("../models/notifications");

module.exports = {

	chatInsertDemo: async(req,res) => {
		 var reviwebyData =  {
            "message": "connectionId",
            "connection_id":"604dffe67551204e8fd13fad"
        }

        var reviwed = await Chat.create(reviwebyData);

        return responseHelper.post(res, (reviwed), "Chat list");
	},


  	chatList: async(req, res) => {

  		try{
		  		var loginId = req.user.id;
		  		
		  		//get connection request
		        let userDetail = await Chat.aggregate([
		            {
		                $match: {
		                    authorized_id: mongoose.Types.ObjectId(loginId),
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
		          let userDetails = await Chat.aggregate([
		           {
		                $match: {
		                    to_user_id: mongoose.Types.ObjectId(loginId),
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
		            return responseHelper.post(res, (af), "Chat list");
		        }else{
		            return responseHelper.successWithoutData(res, 'No record found');
		        }
	        }
	    catch(err){
	      console.log(err);
	    }
	   
	},


	chatPaginationList: async(req, res) => {
		try{

			var chatList = await Chat.find({ chat_id: { $lt: req.body.chat_id }, 
						connection_id:mongoose.Types.ObjectId(req.body.connection_id)  
					}).sort({'chat_id': -1}).limit(15);

			if(chatList){
	            return responseHelper.post(res, (chatList), "Chat list");
	        }else{
	            return responseHelper.successWithoutData(res, 'No record found');
	        }
		}catch(err){
			console.log(err);
		}
	},

	notificationList: async(req, res) => {
		try{
			var loginId = req.user.id;
			var notificationList = await Notification.find({"to_user_id": mongoose.Types.ObjectId(loginId) });

			/*var finalData = {
				"notificationList" : notificationList,
				//"notificationCount" : notificationList.length
			}*/

			if(notificationList.length < 0){
	            return responseHelper.post(res, notificationList, "Notification list");
	        }else{
	            return responseHelper.successWithoutData(res, 'No record found');
	        }

		}catch(err){
			console.log(err);
			return responseHelper.onError(res, err, 'Something went wrong')
		}
	},

	resetNotificationCount: async(req, res) => {
		try{
			var loginId = req.user.id;
			var notificationList = await Notification.updateMany(
					{"to_user_id": mongoose.Types.ObjectId(loginId) },
					{"is_read": true}
				);

	        return responseHelper.successWithoutData(res, {},  'Count Reset successfully');
	       
		}catch(err){
			console.log(err);
			return responseHelper.onError(res, err, 'Something went wrong')
		}
	},

	notificationCount: async(req, res) => {
		try{
			var loginId = req.user.id;
			var notificationList = await Notification.countDocuments({"to_user_id": mongoose.Types.ObjectId(loginId), 
											"is_read":false});

			return responseHelper.successWithoutData(res, notificationList, 'Notification count');
		}catch(err){
			console.log(err);
			return responseHelper.onError(res, err, 'Something went wrong')
		}
	}

}




