exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('menus', function (table) {
      table.increments(); //gives auto incrementing ids
      table.string('name', 128).notNullable();
      table.timestamps(true, true);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('menus');
};
