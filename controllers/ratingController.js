var mongoose = require('mongoose');
var User = require("../models/user");
var Rating = require("../models/ratings");
var Review = require("../models/reviews");
var Connection = require("../models/connections");
const responseHelper = require('../helpers/responseHelper');
const fs = require('fs');

module.exports = {

  addRating: async(req, res) => {
    try{
          data =  {
            "to_user_id":req.body.to_user_id,
            "authorized_id":req.user.id,
            "rating": req.body.rating
          }

        var con = await Rating.create(data);

        return responseHelper.post(res, con, 'Rating added successfully');
    }catch(err){
      return responseHelper.onError(res, err, 'Error while adding rating');
    }
  },

  addReview: async(req, res) => {
    try{
          var publicData = [];
          var privateData = [];
          var toUserId = req.body.to_user_id;
          var connectionId = req.body.connection_id;

          var publicBodyData = req.body.public;
          var privateBodyData = req.body.private;

          var publicReview  = await publicBodyData.map(item => {
                            publicData.push({
                                  "to_user_id":toUserId,
                                  "authorized_id":req.user.id,
                                  "question":item.question,
                                  "review":item.review,
                                  "review_type":"public",
                                  "connection_id": connectionId
                                })
                            });

          var privateReview = await privateBodyData.map(item => {
                            privateData.push({
                                  "to_user_id":toUserId,
                                  "authorized_id":req.user.id,
                                  "question":item.question,
                                  "review":item.review,
                                  "review_type":"private",
                                  "connection_id": connectionId
                                })
                            });

         await Review.insertMany(publicData);
         await Review.insertMany(privateData);

         var user = await Connection.findOneAndUpdate(
                    {_id: connectionId }
                    ,{is_reviwed:true}
                ).lean();

        return responseHelper.post(res, {}, 'Review added successfully');
    }catch(err){
      return responseHelper.onError(res, err, 'Error while adding review');
    }
  },

  getReview: async(req, res) => {
    try{

        //Get reveiws
        var reviews = await Review.find({"authorized_id": mongoose.Types.ObjectId(req.user.id), 
                                    "to_user_id": mongoose.Types.ObjectId(req.body.to_user_id) },
                                  ).lean();
        
        return responseHelper.post(res, reviews, 'Review get successfully');
    }catch(err){
      return responseHelper.onError(res, err, 'Error while fetching review');
    }
  }
}




