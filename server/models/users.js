// models/users.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

var bcrypt = require('bcrypt');
var pwd = "1234";
var hashpwd = bcrypt.hashSync(pwd,bcrypt.genSaltSync(8),null);

const Users = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    experience: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    userImage: {
        type: Sequelize.STRING
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 1   
    },
    role: {
        type: Sequelize.ENUM,
        values: ['user','instructor','admin'],
        defaultValue: 'user'
    },
    last_login_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: "offline"
    },
    expNeeded: {
        type: Sequelize.INTEGER,
        defaultValue:0
    },
    coin: {
        type: Sequelize.INTEGER,
        defaultValue:0
    },
    rank: {
        type:Sequelize.STRING,
        defaultValue: 'bronze'
    }
});

// force: true will drop the table if it already exists
Users.sync({force: false, logging:console.log}).then(()=>{
    console.log("users table synced");
    return Users.upsert({
        id: 1,
        name: 'Ben',
        email: 'a@b.com',
        password: hashpwd,
        userImage: 'mean.jpg'
        //experience: 10
    })
});

module.exports = sequelize.model('Users', Users);