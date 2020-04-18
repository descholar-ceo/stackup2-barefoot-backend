import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const basename = _basename(__filename);
const env = process.env.NODE_ENV;
const config = require('../config.js')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

readdirSync(__dirname)
  .filter((file) => {
    const isTrue = (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    return isTrue;
  })
  .forEach((file) => {
    const model = sequelize.import(join(__dirname, file));
    db[model.name] = model;
  });


Object.keys(db).forEach((modelName) => {
  db[modelName].associate(db); 
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
