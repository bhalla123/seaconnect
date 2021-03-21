var mongoose = require('mongoose');
var User = require("../models/user");
var Rating = require("../models/ratings");
var Review = require("../models/reviews");
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
          data =  {
            "to_user_id":req.body.to_user_id,
            "authorized_id":req.user.id,
            "review": req.body.review,
            "message":req.body.message
          }

        var con = await Review.create(data);

        return responseHelper.post(res, con, 'Review added successfully');
    }catch(err){
      return responseHelper.onError(res, err, 'Error while adding review');
    }
  }
}




