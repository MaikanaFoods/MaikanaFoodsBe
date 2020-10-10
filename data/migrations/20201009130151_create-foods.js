exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('food', function (table) {
      //Auto Incrementing ID
      table.increments();
      //Foreign Key
      table
        .integer('menu_id')
        .unsigned() //does not allow integers to be negative
        .references('id')
        .inTable('menus')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      //Title
      table.string('name').notNullable();
      // Price
      table.decimal('price').notNullable();
      //Body
      table.string('description', 256).notNullable();
      //Img_URL
      table.string('type').notNullable();
      //Time Stemp
      table.timestamps(true, true);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('food');
};
