var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PushDeviceSchema = new Schema({   
    token:{
    	type: String,
        deafult:null
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    platform:{
        type: String,
        deafult:null
    },
},{
    timestamps: true
});

module.exports = mongoose.model('pushdevices', PushDeviceSchema);