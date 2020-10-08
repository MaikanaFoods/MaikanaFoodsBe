const db = require('../../data/db-config');

const findAll = async () => {
  return await db('menus');
};

const findBy = (filter) => {
  return db('menus').where(filter);
};

const findById = async (id) => {
  return db('menus').where({ id }).first().select('*');
};

const create = async (menu) => {
  return db('menus').insert(menu).returning('*');
};

const update = (id, menu) => {
  console.log(menu);
  return db('menus').where({ id: id }).first().update(menu).returning('*');
};

const remove = async (id) => {
  return await db('menus').where({ id }).del();
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
  create,
  update,
  remove,
  findOrCreateMenu,
};
