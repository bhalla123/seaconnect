'use strict';

const moment = require('moment');
const path = require('path');
const fs = require('fs');
const helper = require('./helper');

class Socket{

    constructor(socket){
        this.io = socket;
    }

    socketEvents(){
        this.io.on('connection', (socket) => {

            socket.on('deleteChat', async (chatId) => {  
                const response = await helper.deleteChatRecord(chatId);

                if(response &&  response !== null){
                    this.io.emit('chatDeleted', response);
                }else{
                    console.error(`Socket connection failed, for chat Id ${chatId}.`);
                }
            });

            /**
            * get the user's Chat list
            */
            socket.on('chatList', async (userId) => {
                const result = await helper.getChatList(userId);
                this.io.to(socket.id).emit('chatListRes', {
                    userConnected: false,
                    chatList: result.chatlist
                });

                socket.broadcast.emit('chatListRes', {
                    userConnected: true,
                    userId: userId,
                    socket_id: socket.id
                });
            });
            /**
            * get the get messages
            */
            socket.on('getMessages', async (data) => { 
                const result = await helper.getMessages(data.pokeId);
				if (result === null) {
                    this.io.emit('getMessagesResponse', {result:[], pokeId:data.pokeId});
				}else{
                    this.io.emit('getMessagesResponse', {result:result, pokeId:data.pokeId});
				}
            });

            /**
            * send the messages to the user
            */
            socket.on('addMessage', async (response) => {
                response.date = new moment().format("Y-MM-D");
                response.time = new moment().format("hh:mm A");
                this.insertMessage(response, socket);

                console.log(response);
                
                //socket.to(response.toSocketId).emit('addMessageResponse', response);
                this.io.emit('addMessageResponse', response);
            });

            socket.on('disconnect', async () => {
                const isLoggedOut = await helper.logoutUser(socket.id);
                socket.broadcast.emit('chatListRes', {
                    userDisconnected: true,
                    socket_id: socket.id
                });
        	});
        });
    }

    async insertMessage(data, socket){
        const sqlResult = await helper.insertMessages({
            from_user_id: data.from_user_id,
            to_user_id: data.to_user_id,
            message: data.message,
            date: data.date,
            time: data.time,
            connection_id: data.connection_id
        });
    }

    socketConfig(){
        this.io.use( async (socket, next) => {
            let userId = socket.request._query['id'];
            let userSocketId = socket.id;
            const response = await helper.addSocketId(userId, userSocketId);
            if(response &&  response !== null){
                next();
            }else{
                console.error(`Socket connection failed, for  user Id ${userId}.`);
            }
        });
        this.socketEvents();
    }
}
module.exports = Socket;
