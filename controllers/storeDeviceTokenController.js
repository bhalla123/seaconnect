var mongoose = require('mongoose');
var User = require("../models/user");
var PushDevice = require("../models/pushdevice");

const responseHelper = require('../helpers/responseHelper');
const fs = require('fs');

module.exports = {

  sendRequest: async(req, res) => {
    try{
          data =  {
            "user_id": req.user.id,
            "token":req.body.token,
            "platform":req.body.platform
          }
          
          var data = await PushDevice.findOneAndUpdate({user_id: mongoose.Types.ObjectId(req.user.id)}, data, {upsert: true}, function(err, doc) {
              if (err) return res.send(500, {error: err});
          });

        return responseHelper.post(res, data, 'Token stored successfully');
    }catch(err){
      return responseHelper.onError(res, err, 'Error while sending status request');
    }
  },
}




