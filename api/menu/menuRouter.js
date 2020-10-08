const express = require('express');
const Menus = require('./menuModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Menu:
 *      type: object
 *      required:
 *        - id
 *        - name
 *      properties:
 *        id:
 *          type: string
 *          description: This is a foreign key (the okta user ID)
 *        name:
 *          type: string
 *      example:
 *        id: '00uhjfrwdWAQvD8JV4x6'
 *        name: 'Breakfast menu'
 *
 * /menus:
 *  get:
 *    description: Returns a list of menus
 *    summary: Get a list of all menus
 *    security:
 *      - okta: []
 *    tags:
 *      - menu
 *    responses:
 *      200:
 *        description: array of menus
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Menu'
 *              example:
 *                - id: '00uhjfrwdWAQvD8JV4x6'
 *                  name: 'Breakfast Menu'
 *                - id: '013e4ab94d96542e791f'
 *                  name: 'Lunch Menu'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', function (req, res) {
  Menus.findAll()
    .then((menus) => {
      res.status(200).json(menus);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

/**
 * @swagger
 * components:
 *  parameters:
 *    menuId:
 *      name: id
 *      in: path
 *      description: ID of the menu to return
 *      required: true
 *      example: 00uhjfrwdWAQvD8JV4x6
 *      schema:
 *        type: string
 *
 * /menu/{id}:
 *  get:
 *    description: Find menus by ID
 *    summary: Returns a single menu
 *    security:
 *      - okta: []
 *    tags:
 *      - menu
 *    parameters:
 *      - $ref: '#/components/parameters/menuId'
 *    responses:
 *      200:
 *        description: A menu object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Menu'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'Menu not found'
 */
router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Menus.findById(id)
    .then((menu) => {
      if (menu) {
        res.status(200).json(menu);
      } else {
        res.status(404).json({ error: 'MenuNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @swagger
 * /menu:
 *  post:
 *    summary: Add a menu
 *    security:
 *      - okta: []
 *    tags:
 *      - menu
 *    requestBody:
 *      description: Menu object to to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Menu'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'Menu not found'
 *      200:
 *        description: A menu object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: menu created
 *                menu:
 *                  $ref: '#/components/schemas/Menu'
 */
router.post('/', async (req, res) => {
  const menu = req.body;
  if (menu) {
    const id = menu.id || 0;
    try {
      await Menus.findById(id).then(async (pf) => {
        if (pf == undefined) {
          //menu not found so lets insert it
          await Menus.create(menu).then((menu) =>
            res.status(200).json({ message: 'menu created', menu: menu[0] })
          );
        } else {
          res.status(400).json({ message: 'menu already exists' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'Menu missing' });
  }
});
/**
 * @swagger
 * /menu:
 *  put:
 *    summary: Update a menu
 *    security:
 *      - okta: []
 *    tags:
 *      - menu
 *    requestBody:
 *      description: Menu object to to be updated
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Menu'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A menu object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: menu created
 *                menu:
 *                  $ref: '#/components/schemas/Menu'
 */
router.put('/', (req, res) => {
  const menu = req.body;
  if (menu) {
    const id = menu.id || 0;
    Menus.findById(id)
      .then(
        Menus.update(id, menu)
          .then((updated) => {
            res.status(200).json({ message: 'menu created', menu: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update menu '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find menu '${id}'`,
          error: err.message,
        });
      });
  }
});
/**
 * @swagger
 * /menu/{id}:
 *  delete:
 *    summary: Remove a menu
 *    security:
 *      - okta: []
 *    tags:
 *      - menu
 *    parameters:
 *      - $ref: '#/components/parameters/menuId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A menu object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: Menu '00uhjfrwdWAQvD8JV4x6' was deleted.
 *                menu:
 *                  $ref: '#/components/schemas/Menu'
 */
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  try {
    Menus.findById(id).then((menu) => {
      Menus.remove(menu.id).then(() => {
        res
          .status(200)
          .json({ message: `Menu '${id}' was deleted.`, menu: menu });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete menu with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
