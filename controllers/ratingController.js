var mongoose = require('mongoose');
var User = require("../models/user");
var Rating = require("../models/ratings");
var Review = require("../models/reviews");
var ReviewedBy = require("../models/reviwedby");
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
          var publicRating = 0;
          var toUserId = req.body.to_user_id;
          var connectionId = req.body.connection_id;
          var displayRating = req.body.display_rating;
          var displayReview = req.body.display_review;

          var publicBodyData = req.body.public;
          var privateBodyData = req.body.private;

          var p  = await publicBodyData.map(item => {
                              if(item.type == "rating"){
                                publicRating+=item.review;
                              }
                            });

          var avgRating = publicRating/3;

          var publicReview  = await publicBodyData.map(item => {
                            publicData.push({
                                  "to_user_id":toUserId,
                                  "authorized_id":req.user.id,
                                  "question":item.question,
                                  "review":item.review,
                                  "review_type":"public",
                                  "type":item.type,
                                  "connection_id": connectionId,
                                  "avg_rating": avgRating,
                                  "display_rating": displayRating,
                                  "display_review": displayReview
                                })
                            });

          var privateReview = await privateBodyData.map(item => {
                            privateData.push({
                                  "to_user_id":toUserId,
                                  "authorized_id":req.user.id,
                                  "question":item.question,
                                  "review":item.review,
                                  "type":item.type,
                                  "review_type":"private",
                                  "connection_id": connectionId,
                                  "avg_rating": avgRating
                                })
                            });

         await Review.insertMany(publicData);
         await Review.insertMany(privateData);


          // insert user rating
          {
            //get avg rating
            var rating = await Review.aggregate([
                 {
                      $match: {
                        to_user_id: mongoose.Types.ObjectId(toUserId),
                        review_type:"public",
                        type: "rating"
                      }
                  },

                  { 
                    $addFields: {
                      convertedRating: { $toDouble: "$review"}
                    },  
                  },

                  {
                    $group: {
                        _id: "$to_user_id",
                        avgRating: { "$avg": {$trunc: [ "$convertedRating", 1 ]} }
                    }
                  } 
              ]);

            if(rating.length > 0){
              var avgRate = 0;
              rating.map(item => {
                        avgRate = item.avgRating
                        })

            }else{
              var avgRate = 0;
            }


            var a = await User.findOneAndUpdate({
                  _id: toUserId,
                }, {
                  avg_rating: parseFloat(avgRate).toFixed(1)
                }).lean();
          }

         var reviwebyData =  {
            "connection_id": connectionId,
            "user_id":req.user.id,
          }

         var reviwed = await ReviewedBy.create(reviwebyData);

         if(reviwed){
            var reviwedCount = await ReviewedBy.find({"connection_id": connectionId}).count();

            if(reviwedCount == 2){
              var a = await Connection.findOneAndUpdate({
                  _id: connectionId,
                }, {
                  is_reviwed: true
                }).lean();

              console.log(a);
            }
         }

        return responseHelper.post(res, {}, 'Review added successfully');
    }catch(err){
      console.log(err);
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




