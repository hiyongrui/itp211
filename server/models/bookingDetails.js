var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const bookingDetails = sequelizeInstance.define('bookingDetails', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    booked_id: {
        type: Sequelize.INTEGER
    },
    day: {
        type: Sequelize.STRING
    },
    timing: {
        type: Sequelize.STRING
    },
    bookingDate: {
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

bookingDetails.sync({ force: false, logging: console.log }).then(() => {
    console.log("bookingDetails table synced");
});
    
module.exports = sequelizeInstance.model('bookingDetails', bookingDetails);
