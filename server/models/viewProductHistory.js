var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const viewProductHistory = sequelizeInstance.define('viewProductHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: Sequelize.INTEGER
    },
    user_id:{
        type: Sequelize.INTEGER,
    },
    connect_sid: {
        type: Sequelize.STRING
    }
})

viewProductHistory.sync({ force: false, logging: console.log }).then(() => {
    console.log("viewProductHistory table synced");

});

module.exports = sequelizeInstance.model('viewProductHistory', viewProductHistory);