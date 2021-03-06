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
    avg_rating:{
        type: String,
        default:null
    },
    type:{
        type: String,
        default:null
    },
    display_review:{
        type: String,
        default:null
    },
    display_rating:{
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
    connection_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Connection'
    },

},{
    timestamps: true
});

module.exports = mongoose.model('reviews', ReviewSchema);