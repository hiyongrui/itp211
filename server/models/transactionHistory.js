var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const transactionHistory = sequelizeInstance.define('transactionHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: Sequelize.STRING
        
    },
    product_name: {
        type: Sequelize.STRING,
        trim: true
    },
    product_type: {
        type: Sequelize.STRING
    },
    product_condition: {
        type: Sequelize.STRING
    },
    product_price: {
        type: Sequelize.INTEGER,
        trim: true
    },
    product_image: {
        type: Sequelize.STRING
    },
    seller_name: {
        type: Sequelize.INTEGER
    },
    transactionId: {
        type: Sequelize.INTEGER
    },
    product_status: {
        type: Sequelize.BOOLEAN
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

transactionHistory.sync({ force: false, logging: console.log }).then(() => {
    console.log("transactionHistory table synced");
});
    
module.exports = sequelizeInstance.model('transactionHistory', transactionHistory);