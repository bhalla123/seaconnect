var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InteractionSchema = new Schema({   
    name:{
        type: String,
        deafult: null
    }
},{ versionKey: false });


module.exports = mongoose.model('Interaction', InteractionSchema);