// connects sequelize with the CRUD_backend database
const { Sequelize } = require("sequelize");
const {name} = require("../package.json");
// const {Pool} = require('pg')
require('dotenv').config();


const db = new Sequelize(`postgres://localhost:4000/${name}`, {
    logging: false,
    
});

//process.env.DATABASE_URL

module.exports = db;