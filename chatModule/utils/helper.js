'user strict';

const DB = require('./db');
const path = require('path');
const fs = require('fs');
const Chat  = require("../model/chat");
var mongoose = require('mongoose');

class Helper{

	constructor(app){
		this.db = DB;
	}

	async insertMessages(params){
		try {
			let  chatMessage  =  new Chat({ message: params.message, from_user_id: params.from_user_id, to_user_id: params.to_user_id, date: params.date, time:params.time, connection_id:params.connection_id});
    		chatMessage.save();

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

			console.log("list", chatMsgList);
			return chatMsgList;

		} catch (error) {
			console.warn(error);
			return null;
		}
	}
}
module.exports = new Helper();
