const express = require('express');
const authRequired = require('../middleware/authRequired');
const Foods = require('./foodModel');
const router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    food:
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
 *        name: 'Breakfast food'
 *
 * /foods:
 *  get:
 *    description: Returns a list of foods
 *    summary: Get a list of all foods
 *    security:
 *      - okta: []
 *    tags:
 *      - food
 *    responses:
 *      200:
 *        description: array of foods
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/food'
 *              example:
 *                - id: '00uhjfrwdWAQvD8JV4x6'
 *                  name: 'Breakfast food'
 *                - id: '013e4ab94d96542e791f'
 *                  name: 'Lunch food'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', function (req, res) {
  Foods.findAll()
    .then((foods) => {
      res.status(200).json(foods);
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
 *    foodId:
 *      name: id
 *      in: path
 *      description: ID of the food to return
 *      required: true
 *      example: 00uhjfrwdWAQvD8JV4x6
 *      schema:
 *        type: string
 *
 * /food/{id}:
 *  get:
 *    description: Find foods by ID
 *    summary: Returns a single food
 *    security:
 *      - okta: []
 *    tags:
 *      - food
 *    parameters:
 *      - $ref: '#/components/parameters/foodId'
 *    responses:
 *      200:
 *        description: A food object
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/food'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'food not found'
 */
router.get('/:id', function (req, res) {
  const id = String(req.params.id);
  Foods.findById(id)
    .then((food) => {
      if (food) {
        res.status(200).json(food);
      } else {
        res.status(404).json({ error: 'foodNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * @swagger
 * /food:
 *  post:
 *    summary: Add a food
 *    security:
 *      - okta: []
 *    tags:
 *      - food
 *    requestBody:
 *      description: food object to to be added
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/food'
 *    responses:
 *      400:
 *        $ref: '#/components/responses/BadRequest'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        description: 'food not found'
 *      200:
 *        description: A food object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: food created
 *                food:
 *                  $ref: '#/components/schemas/food'
 */

router.post('/', authRequired, async (req, res) => {
  const food = req.body;
  if (food) {
    const id = food.id || 0;
    try {
      await Foods.findById(id).then(async (pf) => {
        if (pf == undefined) {
          //food not found so lets insert it
          await Foods.create(food).then((food) =>
            res.status(200).json({ message: 'food created', food: food[0] })
          );
        } else {
          res.status(400).json({ message: 'food already exists' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'food missing' });
  }
});
/**
 * @swagger
 * /food:
 *  put:
 *    summary: Update a food
 *    security:
 *      - okta: []
 *    tags:
 *      - food
 *    requestBody:
 *      description: food object to to be updated
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/food'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A food object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: food created
 *                food:
 *                  $ref: '#/components/schemas/food'
 */
router.put('/', authRequired, (req, res) => {
  const food = req.body;
  if (food) {
    const id = food.id || 0;
    Foods.findById(id)
      .then(
        Foods.update(id, food)
          .then((updated) => {
            res.status(200).json({ message: 'food created', food: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update food '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find food '${id}'`,
          error: err.message,
        });
      });
  }
});
/**
 * @swagger
 * /food/{id}:
 *  delete:
 *    summary: Remove a food
 *    security:
 *      - okta: []
 *    tags:
 *      - food
 *    parameters:
 *      - $ref: '#/components/parameters/foodId'
 *    responses:
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 *      200:
 *        description: A food object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: A message about the result
 *                  example: food '00uhjfrwdWAQvD8JV4x6' was deleted.
 *                food:
 *                  $ref: '#/components/schemas/food'
 */
router.delete('/:id', authRequired, (req, res) => {
  const id = req.params.id;
  try {
    Foods.findById(id).then((food) => {
      Foods.remove(food.id).then(() => {
        res
          .status(200)
          .json({ message: `food '${id}' was deleted.`, food: food });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete food with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
