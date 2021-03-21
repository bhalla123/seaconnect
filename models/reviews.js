var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({   
    review:{
        type: String,
        deafult: null
    },
    question:{
    	type: String,
        deafult:null
    },
    review_type:{
        type: String,
        default:null
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

module.exports = mongoose.model('reviews', ReviewSchema);