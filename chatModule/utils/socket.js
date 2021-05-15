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

            /**
            * get the get messages
            */
            socket.on('getMessages', async (data) => { 
                const result = await helper.getMessages(data.connectionId);
				if (result === null) {
                    this.io.emit('getMessagesResponse', {result:[], connectionId:data.connectionId});
				}else{
                    this.io.emit('getMessagesResponse', {result:result, connectionId:data.connectionId});
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
        this.socketEvents();
    }
}
module.exports = Socket;
