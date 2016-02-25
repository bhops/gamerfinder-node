var jwt = require('jsonwebtoken');

var createJwt = module.exports = function(user) {
  return jwt.sign({user: user}, 'secret', {
    expiresIn: 1440000 // expires in 24 hours
  });
}
