var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Cart = sequelizeInstance.define('Cart', {
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
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
