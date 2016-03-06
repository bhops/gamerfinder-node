var express = require('express');
var services = require('./services');
var passport = services.passport;

// Create a new Express application.
var app = express();

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());


// Note: We don't need the initial login flow because the frontend will provide
// us with an access code to authenticate the user.
app.get('/login/facebook/callback',
  passport.authenticate('facebook', { session: false}),
  function(req, res) {
    res.json({token: services.jwt(req.user)});
  });

app.get('/profile',
  passport.authenticate('jwt', { session: false}),
  function(req, res){
    res.json({ user: req.user });
  });

app.listen(3000);

module.exports = app;
