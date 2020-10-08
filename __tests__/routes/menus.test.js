const request = require('supertest');
const express = require('express');
const Menus = require('../../api/menu/menuModel.js');
const menuRouter = require('../../api/menu/menuRouter.js');
const server = express();
server.use(express.json());

jest.mock('../../api/menu/menuModel');

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
        id: '5xvm9byaat',
        name: 'Dinner',
      });
      const res = await request(server).get('/menus/5xvm9byaat');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Dinner');
      expect(Menus.findById.mock.calls.length).toBe(1);
    });

    it('should return 404 when no menu found', async () => {
      Menus.findById.mockResolvedValue();
      const res = await request(server).get('/menus/d376de0577681ca93614');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('MenuNotFound');
    });
  });

  describe('POST /menus', () => {
    it('should return 200 when menu is created', async () => {
      const menu = {
        id: 'jki8uj49k8',
        name: 'Vegetarian',
      };
      Menus.findById.mockResolvedValue(undefined);
      Menus.create.mockResolvedValue([
        Object.assign({ id: 'jki8uj49k8' }, menu),
      ]);
      const res = await request(server).post('/menus').send(menu);

      expect(res.status).toBe(200);
      expect(res.body.menu.id).toBe('jki8uj49k8');
      expect(Menus.create.mock.calls.length).toBe(1);
    });
  });

  describe('PUT /menus', () => {
    it('should return 200 when menu is created', async () => {
      const menu = {
        id: 'koi7890lkj',
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
