var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviwedBySchema = new Schema({   
    user_id:{
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

module.exports = mongoose.model('reviwedBy', ReviwedBySchema);