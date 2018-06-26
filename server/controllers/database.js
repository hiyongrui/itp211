// my sql work bench , create new database p5db , password is mysql
// first thing npm install mysql 2
// url is http://collabedit.com/85f5u , go there copy paste

var Sequelize = require('sequelize');
var sequelizeTransforms = require('sequelize-transforms');

const sequelize = new Sequelize('p4db', 'root', 'mysql', {
    host: '127.0.0.1',
    port: '3306', // not 3336 , from mysql workbench
    dialect: 'mysql',
    timezone: '+08:00',  //represent singapore time + 8 hrs ahead , default is UTC
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    operatorsAliases: false
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

sequelizeTransforms(sequelize);


module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;




/*
var Sequelize = require('sequelize');
var sequelizeTransforms = require('sequelize-transforms');

const sequelize =new Sequelize({
    dialect: 'mssql',
    dialectModulePath: 'tedious',
    dialectOptions: {
      driver: 'SQL Server Native Client 11.0',
      instanceName: 'SQLEXPRESS'
    },
    host: 'localhost',
    username: 'p4',
    password: 'p4pw',
    database: 'p4db',
    pool: {
        min: 0,
        max: 10,
        idle: 10000
      }
  });

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

sequelizeTransforms(sequelize);

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize; 
*/
