const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('menus')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('menus').insert([
        { id: 1, name: 'Breakfast' },
        { id: 2, name: 'Lunch' },
        { id: 3, name: 'Dinner' },
        { id: 4, name: 'Vegan' },
      ]);
    });
};
