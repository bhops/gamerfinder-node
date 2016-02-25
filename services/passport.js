var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var User = require('../models').User;

var opts = {
  jwtFromRequest: require('passport-jwt').ExtractJwt.fromAuthHeader(),
  secretOrKey: 'secret'
}

// Configure the Facebook strategy for use by Passport.
// This strategy is only used for initial login, from then on JWT is used.
passport.use(new Strategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/callback',
    profileFields: ['id', 'first_name', 'last_name', 'gender', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    User.createFromProviderIfNotExists('facebook', profile, function(err, user) {
      return cb(null, user);
    });
  }));


// This is used for every authenticated request except for logging in to receive
// the initial JWT
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.where({id: jwt_payload.user.id})
    .fetch().then(function(user) {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  }));

module.exports = passport;
