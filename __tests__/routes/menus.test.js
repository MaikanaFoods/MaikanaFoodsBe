const request = require('supertest');
const express = require('express');
const Menus = require('../../api/menu/menuModel.js');
const Food = require('../../api/food/foodModel');
const menuRouter = require('../../api/menu/menuRouter.js');
const server = express();
server.use(express.json());

jest.mock('../../api/menu/menuModel');
jest.mock('../../api/food/foodModel');

describe('menus router endpoints', () => {
  beforeAll(() => {
    // This is the module/route being tested
    server.use('/menus', menuRouter);
    jest.clearAllMocks();
  });

  describe('GET /menus', () => {
    it('should return 200', async () => {
      Menus.findAll.mockResolvedValue([]);
      const res = await request(server).get('/menus');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(0);
      expect(Menus.findAll.mock.calls.length).toBe(1);
    });
  });

  describe('GET /menus/:id', () => {
    it('should return 200 when menu found', async () => {
      Menus.findById.mockResolvedValue({
        id: 1,
        name: 'Breakfast',
      });
      const res = await request(server).get('/menus/1');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Breakfast');
      expect(Menus.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no menu found', async () => {
      Menus.findById.mockResolvedValue();
      const res = await request(server).get('/menus/94');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MenuNotFound');
    });
  });

  describe('GET /menus/:id/foods', () => {
    it('should return 200 when menu foods are found', async () => {
      Menus.findById.mockResolvedValue({
        id: 1,
        name: 'Breakfast',
      });
      Food.findByMenuId.mockResolvedValue([
        {
          id: 1,
          menu_id: 1,
          name: 'Spinach & Apple Quesadilla',
          price: '9.75',
          description:
            'A spinach & apple pesto with cheese in a whole wheat tortilla. This comes with a side of rice and black beans.',
          type: 'vegetarian',
        },
        {
          id: 4,
          menu_id: 1,
          name: 'Banana chocolate oatmeal pancakes',
          price: '9.75',
          description:
            'Made with raw cacao powder, bananas, and whole wheat flour, oats and more.',
          type: 'vegan',
        },
        {
          id: 0,
          menu_id: 1,
          name: 'Vegan Black Bean Brownies',
          price: '9.75',
          description:
            'These delicious brownies are made with really made with black beans and raw cacao powder! They are delicious and not overly sweet, thanks to organic maple syrup. 2 per order',
          type: 'vegetarian',
        },
      ]);
      const res = await request(server).get('/menus/1/foods');
      console.log(res);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Breakfast');
      expect(res.body.foods.length).toBe(3);
      expect(Food.findByMenuId.mock.calls.length).toBe(1);
    });

    it('should return 404 when no menu found', async () => {
      Menus.findById.mockResolvedValue();
      const res = await request(server).get('/menus/94');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MenuNotFound');
    });
  });

  describe('POST /menus', () => {
    it('should return 200 when menu is created', async () => {
      const menu = {
        id: 2,
        name: 'Lunch',
      };
      Menus.findById.mockResolvedValue(undefined);
      Menus.create.mockResolvedValue([Object.assign({ id: 2 }, menu)]);
      const res = await request(server).post('/menus').send(menu);

      expect(res.status).toBe(200);
      expect(res.body.menu.id).toBe(2);
      expect(Menus.create.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /menus', () => {
    it('should return 200 when menu is created', async () => {
      const menu = {
        id: 3,
        name: 'Mexican',
      };
      Menus.findById.mockResolvedValue(menu);
      Menus.update.mockResolvedValue([menu]);

      const res = await request(server).put('/menus/').send(menu);
      expect(res.status).toBe(200);
      expect(res.body.menu.name).toBe('Mexican');
      expect(Menus.update.mock.calls.length).toBe(1);
    });
  });
});
