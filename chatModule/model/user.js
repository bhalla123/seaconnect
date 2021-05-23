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
    },
    bio:{
        type: String,
        deafult: null
    },
    latitude:{
        type: String,
        deafult: null
    },
    longitude:{
        type: String,
        deafult: null
    },
    location: {
       type: { type: String },
       coordinates: []
    },

},
{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
});

UserSchema.virtual('profile_image_link').get(function() {
    return this.profile_image !=null ? "http://45.90.108.137:3000/profile/"+this.profile_image : "";
});

UserSchema.index({ location: "2dsphere" });


module.exports = mongoose.model('User', UserSchema);