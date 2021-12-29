import pg from 'pg';

import Organization from './organization.model';
import User from './user.model';
import Profile from './profile.model';
import Role from './role.model';

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectModule: pg,
    schema: 'vitae',
    pool: {
      max: 5,
      min: 0,
      acquire: 20000,
      idle: 10000,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const myOrg = Organization(sequelize, Sequelize);
const myProf = Profile(sequelize, Sequelize);
const myUser = User(sequelize, Sequelize);
const myRole = Role(sequelize, Sequelize);

myUser.belongsToMany(myOrg, { through: myProf });
myOrg.belongsToMany(myUser, { through: myProf });

myProf.belongsTo(myRole);
myRole.hasMany(myProf);

db.organizations = myOrg;
db.users = myUser;
db.profiles = myProf;
db.roles = myRole;

export default db;
