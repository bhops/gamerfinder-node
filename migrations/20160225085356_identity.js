
exports.up = function(knex, Promise) {
  return knex.schema.createTable('identities', function (t) {
    t.string('provider').notNullable();
    t.string('identifier').notNullable();
    t.bigInteger('user_id')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE');
    t.timestamps();

    t.index(['provider', 'identifier']);
    t.index('user_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
