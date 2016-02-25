var checkit = require('checkit');
var bookshelf = require('../services/bookshelf');

var Identity = module.exports = bookshelf.Model.extend({
  tableName: 'identities',
  hasTimestamps: ['created_at', 'updated_at'],
  validations: {
    identifier: 'required',
    provider: 'required',
    user_id: 'required'
  },

  user: function() {
    return this.belongsTo(require('./user'));
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
Identity.find = function(provider, identifier) {
  return Identity.fetchAll()
    .query('where', 'provider', '=', provider, 'AND', 'identifier', '=', identifier)
    .fetch();
}
