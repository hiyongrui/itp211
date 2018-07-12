var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Transaction = sequelizeInstance.define('Transaction', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transactionId: {
        type: Sequelize.INTEGER
    },
    cartPricing: {
        type: Sequelize.INTEGER,
        trim: true
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

Transaction.sync({ force: false, logging: console.log }).then(() => {
    console.log("Transaction table synced");
    Transaction.upsert({
        id: 1,
        transactionId: 1,
        cartPricing: 0,
        user_id: 1
    });
});
    
module.exports = sequelizeInstance.model('Transaction', Transaction);
