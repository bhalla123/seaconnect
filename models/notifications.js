var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({   
    is_read:{
        type: boolean,
        deafult: false
    },
    message:{
    	type: String,
        deafult:null
    },
    authorized_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    timestamps: true
});

module.exports = mongoose.model('notifications', NotificationSchema);