const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();
const JWT_SECRET = "ASDCSFASD";
var User = require("../models/user");
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await User.findOne({
				_id : jwt_payload.id
			});
			if (!user) {
				return done(null, false);
			}
			done(null, user);
		} catch (error) {
			done(error, false);
		}
    }));
};


