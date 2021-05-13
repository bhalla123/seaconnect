var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConnectionSchema = new Schema({   
    authorized_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user_id:{
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status :{
    	type: String,
        deafult: null
    },
    is_reviwed:{
        type: Boolean,
        default:false
    },
},{ versionKey: false });


module.exports = mongoose.model('Connection', ConnectionSchema);