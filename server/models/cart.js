var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Cart = sequelizeInstance.define('Cart', {
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
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

Cart.sync({ force: false, logging: console.log }).then(() => {
    console.log("Cart table synced");
});
    
module.exports = sequelizeInstance.model('Cart', Cart);
