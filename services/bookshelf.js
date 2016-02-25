var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3'
  },
  pool: {
    min: 1,
    max: 5
  }
});

// For debugging
knex.on( 'query', function( queryData ) {
    console.log( queryData );
});

var bookshelf = module.exports = require('bookshelf')(knex);
