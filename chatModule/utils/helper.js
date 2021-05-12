'user strict';

const DB = require('./db');
const path = require('path');
const fs = require('fs');
const Chat  = require("../model/chat");

class Helper{

	constructor(app){
		this.db = DB;
	}

	async deleteChatRecord(chatId){console.log(chatId);
		try {
			var data = await this.db.query("Delete FROM chats WHERE id IN " + "(" + chatId + ")");

			return ({
		            status: "true",
		            message: "Record deleted Successfully "
		        }); 
		} catch (error) {
			console.warn(error);
			return ({
		            status: "false",
		            message: "something went wrong"
		        });
		}
	}

	async logoutUser(userSocketId){
		return await this.db.query(`UPDATE users SET socket_id = ?, online= ? WHERE socket_id = ?`, ['','N',userSocketId]);
	}

	getChatList(userId){
		try {
			return Promise.all([
				this.db.query(`SELECT id, first_name, socket_id, online, updated_at FROM users WHERE id != ? and is_verified = 1`, [userId])
			]).then( (response) => {
				return {
					chatlist : response[0]
				};
			}).catch( (error) => {
				console.warn(error);
				return (null);
			});
		} catch (error) {
			console.warn(error);
			return null;
		}
	}

	async insertMessages(params){
		try {
			let  chatMessage  =  new Chat({ message: params.message, from_user_id: params.from_user_id, to_user_id: params.to_user_id, date: params.date, time:params.time});
    		chatMessage.save();

			console.log(message);
			return message;
		} catch (error) {
			console.warn(error);
			return null;
		}
	}

	async getMessages(pokeId){
		try {
			return await this.db.query(
				`SELECT id,from_user_id as fromUserId,to_user_id as toUserId,message,time,date,type,file_format as fileFormat,file_path as filePath, poke_id as pokeId FROM chats WHERE poke_id = ? ORDER BY id ASC
				`,
				[pokeId]
			);
		} catch (error) {
			console.warn(error);
			return null;
		}
	}

	async mkdirSyncRecursive(directory){
		var dir = directory.replace(/\/$/, '').split('/');
        for (var i = 1; i <= dir.length; i++) {
            var segment = path.basename('uploads') + "/" + dir.slice(0, i).join('/');
            !fs.existsSync(segment) ? fs.mkdirSync(segment) : null ;
        }
	}
}
module.exports = new Helper();
