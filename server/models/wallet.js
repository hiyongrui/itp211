var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Wallet = sequelizeInstance.define('Wallet', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    topupDate: {
        type: Sequelize.DATEONLY,
    },
    coinAmt: {
        type: Sequelize.INTEGER
    },
    price: {
        type: Sequelize.INTEGER,
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

Wallet.sync({ force: false, logging: console.log }).then(() => {
    console.log("Wallet table synced");
 
});
    
module.exports = sequelizeInstance.model('Wallet', Wallet);
