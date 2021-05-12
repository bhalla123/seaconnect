const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  chatSchema  =  new Schema({
    message: {
        type: String,
        deafult: null
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
    }
    },
        {
    timestamps: true
});

let  Chat  =  mongoose.model("Chat", chatSchema);
module.exports  =  Chat;