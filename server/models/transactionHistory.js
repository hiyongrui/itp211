var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const transactionHistory = sequelizeInstance.define('transactionHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: Sequelize.STRING
        
    },
    productName: {
        type: Sequelize.STRING,
        trim: true
    },
    sellerName: {
        type: Sequelize.STRING
    },
    pricing: {
        type: Sequelize.INTEGER,
        trim: true
    },
    transactionId: {
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

transactionHistory.sync({ force: false, logging: console.log }).then(() => {
    console.log("transactionHistory table synced");
});
    
module.exports = sequelizeInstance.model('transactionHistory', transactionHistory);