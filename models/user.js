var checkit = require('checkit');
var Identity = require('./identity');
var bookshelf = require('../services/bookshelf');

var User = module.exports = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: ['created_at', 'updated_at'],
  validations: {
    username: 'required'
  },

  identities: function() {
    return this.hasMany(require('./identity'));
  },

  constructor: function() {
    bookshelf.Model.apply(this, arguments); // super()
    this.on('saving', this.validate.bind(this));
  },

  validate: function() {
    return new checkit(this.validations).run(this.attributes);
  },

  // adding an instance method
  someInstanceMethod: function(a, b) {
    return a + b;
  }
});

// adding a class method
User.createFromProviderIfNotExists = function(provider, user, cb) {
  Identity.where({'provider': provider, 'identifier': user.id})
    .fetch()
    .then(function(identity) {
      if (identity) {
        identity.related('user').fetch().then(function(user) {
          cb(null, user);
        });
      } else {
        // create the user and identity
        User.createFromProvider(provider, user, function(err, user) {
          return cb(null, user);
        });
      }
    });
}

User.createFromProvider = function(provider, user, cb) {
  // TODO: Transaction
  User.forge({
    username: user.emails[0].value
  })
  .save()
  .then(function(saved_user){
    Identity.forge({
      provider: provider,
      identifier: user.id,
      user_id: saved_user.id
    })
    .save()
    .then(function(identity) {
      cb(null, saved_user);
    })
  });
}
