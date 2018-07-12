var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const cardDetails = sequelizeInstance.define('cardDetails', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    issuingNetwork: {
        type: Sequelize.STRING
        
    },
    cardNumber: {
        type: Sequelize.INTEGER,
        trim: true
    },
    cardholder: {
        type: Sequelize.STRING
    },
    CVV: {
        type: Sequelize.INTEGER,
    },
    expiryDate: {
        type: Sequelize.DATEONLY
    },
    balance: {
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

cardDetails.sync({ force: false, logging: console.log }).then(() => {
    console.log("cardDetails table synced");
    cardDetails.upsert({
        issuingNetwork: "MasterCard",
        id: 1,
        cardNumber: 123,
        cardholder: "John",
        CVV: 123,
        expiryDate: 2019-11-12,
        balance: 1000,
        user_id: 1
        
    })
});

    
module.exports = sequelizeInstance.model('cardDetails', cardDetails);
