const faker = require('faker');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('food')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('food').insert([
        {
          id: faker.random.number(5),
          menu_id: 1,
          price: 9.75,
          name: 'Spinach & Apple Quesadilla',
          description:
            'A spinach & apple pesto with cheese in a whole wheat tortilla. This comes with a side of rice and black beans.',
          type: 'vegetarian',
        },
        {
          id: faker.random.number(5),
          menu_id: 1,
          price: 9.75,
          name: 'Banana chocolate oatmeal pancakes',
          description:
            'Made with raw cacao powder, bananas, and whole wheat flour, oats and more.',
          type: 'vegan',
        },
        {
          id: faker.random.number(5),
          menu_id: 1,
          price: 9.75,
          name: 'Vegan Black Bean Brownies',
          description:
            'These delicious brownies are made with really made with black beans and raw cacao powder! They are delicious and not overly sweet, thanks to organic maple syrup. 2 per order',
          type: 'vegetarian',
        },
      ]);
    });
};
