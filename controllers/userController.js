var mongoose = require('mongoose');
var User = mongoose.model('User');
const JWT = require('jsonwebtoken');
const helperFxn = require('../helpers/hashPasswords');

signtoken = user => {
  return JWT.sign({
    id: user.dataValues.id,
    role_name: user.dataValues.type,
  }, process.env.JWT_SECRET);
}

exports.signUp = async function(req, res) {
  try {
        const newUser = new User({
            first_name : req.body.firstName,
            user_name : req.body.lastName,
            password : req.body.password,
            gender : req.body.gender,
            dob : req.body.dob,
            interest_in : req.body.interest_in,
            mobile_number : req.body.mobile_number,
            age_range:req.body.age_range,
            email: req.body.email,
            looking_for:req.body.looking_for
        });

        let newPassword = await helperFxn.generatePass(req.body.password);
    
        await User.register(newUser, req.body.password);
        await passport.authenticate("local")(req, res, () => {
          res.redirect("/user/1")
        }); 
    } catch(err) {
      return res.render("user/userSignup");
    }
}



