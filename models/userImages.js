var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserImageSchema = new Schema({   
    image_path:{
        type: String,
        deafult: null
    },
    user_id:{
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    },
});


UserImageSchema.virtual('user_image_link').get(function() {
    return this.image_path !=null ? "http://45.90.108.137:3000/profile/"+this.image_path : "";
});

module.exports = mongoose.model('user_images', UserImageSchema);