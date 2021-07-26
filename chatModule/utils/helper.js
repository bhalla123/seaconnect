'user strict';

const DB = require('./db');
const path = require('path');
const fs = require('fs');
const Chat  = require("../model/chat");
const User  = require("../model/user");
var PushDevice = require("../model/pushdevice");

var mongoose = require('mongoose');
var fcm = require('fcm-notification');
var FCM = new fcm('/var/www/html/seaconnect/siaconnect.json');

class Helper{

	constructor(app){
		this.db = DB;
	}

	async insertMessages(params){
		try {

			console.log(params);
			let  chatMessage  =  new Chat({ message: params.message, from_user_id: params.from_user_id, to_user_id: params.to_user_id, date: params.date, time:params.time, connection_id:params.connection_id, is_read:false});
    		chatMessage.save();

    		//Notifications
    		{
    			var msgTo = params.from_user_id;

          		var userName = await User.findOne({"_id":msgTo}, {user_name:1}).lean();

		        var pushToken = await PushDevice.findOne({
	                user_id: mongoose.Types.ObjectId(params.to_user_id),
	            });


		        if(pushToken){
		        	var token = pushToken.token;

		        	if(pushToken.platform == "android"){
		        		var message = {
						    token: token,
						    notification: {
						  
						    },
						    data: {
						        showForegroundNotification: 'false',
						        type: 'chat',
						        title:userName.user_name + " send you message",
			                	body:params.message,
						    },
						    android: {
						        notification: {
						            clickAction: 'ANDROID_NOTIFICATION_CLICK',
						        },
						    }
						};
console.log(message);
						FCM.send(message, function(err,response){
			              if(err){
			                console.log("Error found", err);
			              }else{
			                console.log("response here", response);
			              }
			            })

		        	}else{
			            var token = pushToken.token;

			            var message = {
			              notification :{
			                title:userName.user_name + " send you message",
			                body:params.message,
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
			                    type:"ChatMessage"
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
	    	}

			console.log("add", chatMessage);
			return chatMessage;
		} catch (error) {
			console.warn(error);
			return null;
		}
	}

	async getMessages(connectionId){
		try {
			var chatMsgList = await Chat.find({"connection_id": mongoose.Types.ObjectId(connectionId)})
										.sort({'chat_id': -1});

			await Chat.update({"connection_id": mongoose.Types.ObjectId(connectionId) },
								{is_read: true},{multi: true});
							

			console.log("list", chatMsgList);
			return chatMsgList;

		} catch (error) {
			console.warn(error);
			return null;
		}
	}
}
module.exports = new Helper();
