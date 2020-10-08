exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('menus', function (table) {
      table.string('id').notNullable().unique().primary();
      table.string('name');
      table.timestamps(true, true);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('menus');
};
