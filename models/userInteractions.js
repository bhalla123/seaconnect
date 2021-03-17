var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserInteractionSchema = new Schema({   
    interaction_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interaction'
    },
    user_id:{
    	type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{ versionKey: false });


module.exports = mongoose.model('UserInteraction', UserInteractionSchema);