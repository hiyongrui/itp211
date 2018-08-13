var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const bookingHistory = sequelizeInstance.define('bookingHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    totalPrice: {
        type: Sequelize.FLOAT
    },
    instructor_id: {
        type: Sequelize.INTEGER
    },
    lesson_name: {
        type: Sequelize.STRING
    },
    purchaseDate: {
        type: Sequelize.DATEONLY
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

bookingHistory.sync({ force: false, logging: console.log }).then(() => {
    console.log("bookingHistory table synced");
});
    
module.exports = sequelizeInstance.model('bookingHistory', bookingHistory);
