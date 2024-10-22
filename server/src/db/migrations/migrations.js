exports.up = function(knex) {
    return knex.schema.createTable('sessions', table => {
      table.increments('id').primary();
      table.string('spotify_id').notNullable();
      table.string('access_token').notNullable();
      table.string('refresh_token').notNullable();
      table.timestamp('expires_at').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('sessions');
  };
  