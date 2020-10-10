const db = require('../../data/db-config');

const findAll = async () => {
  return await db('food');
};

const findBy = (filter) => {
  return db('food').where(filter);
};

const findById = async (id) => {
  return db('food').where({ id }).first().select('*');
};

const findByMenuId = async (menu_id) => {
  return db('food').where({ menu_id }).select('*');
};

const create = async (menu) => {
  return db('food').insert(menu).returning('*');
};

const update = (id, menu) => {
  console.log(menu);
  return db('food').where({ id: id }).first().update(menu).returning('*');
};

const remove = async (id) => {
  return await db('food').where({ id }).del();
};

const findOrCreateMenu = async (menuObj) => {
  const foundMenu = await findById(menuObj.id).then((menu) => menu);
  if (foundMenu) {
    return foundMenu;
  } else {
    return await create(menuObj).then((newMenu) => {
      return newMenu ? newMenu[0] : newMenu;
    });
  }
};

module.exports = {
  findAll,
  findBy,
  findById,
  findByMenuId,
  create,
  update,
  remove,
  findOrCreateMenu,
};
