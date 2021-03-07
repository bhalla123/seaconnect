var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InteractionSchema = new Schema({
    user_id:{
        type: String,
        default:null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name:{
        type: String,
        deafult: null
    }
},{ versionKey: false });


module.exports = mongoose.model('Interaction', InteractionSchema);