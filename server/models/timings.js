var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const timings = sequelizeInstance.define('timings', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    lesson_id: {
        type: Sequelize.INTEGER,
    },
    day: {
        type: Sequelize.STRING
    },
    fromTime: {
        type: Sequelize.STRING
    },
    toTime: {
        type: Sequelize.STRING
    },
    isBooked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

timings.sync({ force: false, logging: console.log }).then(() => {
    console.log("timings table synced");
});
    
module.exports = sequelizeInstance.model('timings', timings);