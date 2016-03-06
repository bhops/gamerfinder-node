var request = require('supertest');
var passportStub = require('passport-stub');
var app = require('../app');

passportStub.install(app);

describe('GET /users', function(){
  afterEach(function() {
    passportStub.logout();
  });
  it('responds with json', function(done) {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

});
