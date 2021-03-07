var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name:{
        type: String,
        default:null,
    },
    user_name:{
        type: String,
        default:null,
    },
    password: {
        type: String,
        default:null,
    },
    gender: {
        type: String,
        deafult: null,
    },
    dob: {
        type: String,
        deafult: null,
    },
    interested_in:{
        type: String,
        deafult: null
    },
    age_range:{
        type: String,
        deafult: null
    },
    email:{
        type: String,
        deafult: null
    },
    mobile_number:{
        type: String,
        deafult: null
    },
    looking_for:{
        type: String,
        deafult: null
    },
    profile_image:{
        type: String,
        deafult: null
    }
},{ versionKey: false });


module.exports = mongoose.model('User', UserSchema);