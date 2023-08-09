// connects sequelize with the CRUD_backend database
const { Sequelize } = require("sequelize");
const {name} = require("../package.json");
// const {Pool} = require('pg')
require('dotenv').config();


const db = new Sequelize(process.env.INSTANCE, {
    dialectModule: require('pg'),
    dialect: 'postgres',
    //ssl true
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});
  

//process.env.DATABASE_URL

module.exports = db;