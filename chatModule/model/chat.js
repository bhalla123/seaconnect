const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const  chatSchema  =  new Schema({
    message: {
        type: String,
        deafult: null
    },
    is_read :{
     type: Boolean,
      deafult: false
    },
    from_user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    connection_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Connection'
    },
    date:{
        type: String,
        deafult: null
    },
    time:{
        type: String,
        deafult: null
    },
    chat_id: {
         type: Number
       }
    },
        {
    timestamps: true
});

chatSchema.plugin(AutoIncrement, {inc_field: 'chat_id'});

let  Chat  =  mongoose.model("Chat", chatSchema);
module.exports  =  Chat;