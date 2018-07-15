var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Product = sequelizeInstance.define('Product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    productId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    productName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sellerName: {
        type: Sequelize.STRING,
        trim: true
    },
    pricing: {
        type: Sequelize.INTEGER
    },
    imageName: {
        type: Sequelize.STRING
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

Product.sync({ force: false, logging: console.log }).then(() => {
    console.log("Product table synced");
    Product.upsert({
        id: 1,
        productId: "123a",
        productName: "Product1",
        sellerName: "seller1",
        pricing: 10,
        user_id: 1
    });
    Product.upsert({
        id: 2,
        productId: "123b",
        productName: "Product2",        
        sellerName: "seller2",
        pricing: 20,
        user_id: 1
    });
    Product.upsert({
        id: 3,
        productId: "123c",
        productName: "Product3",        
        sellerName: "seller3",
        pricing: 30,
        user_id: 1
    });

});
module.exports = sequelizeInstance.model('Product', Product);