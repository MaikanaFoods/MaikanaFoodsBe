const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('menus')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('menus').insert([
        { id: faker.random.alphaNumeric(10), name: 'Breakfast' },
        { id: faker.random.alphaNumeric(10), name: 'Lunch' },
        { id: faker.random.alphaNumeric(10), name: 'Dinner' },
        { id: faker.random.alphaNumeric(10), name: 'Vegan' },
      ]);
    });
};
