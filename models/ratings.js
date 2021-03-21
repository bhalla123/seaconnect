var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReatingSchema = new Schema({   
    rating:{
        type: Number,
        deafult: null
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

module.exports = mongoose.model('ratings', ReatingSchema);