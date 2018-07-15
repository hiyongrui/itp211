// models/profileSetting.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const profileSetting = sequelize.define('profileSetting', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    videoName: {
        type: Sequelize.STRING
    },
    lessons: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING
    },
    Beginner: {
        type: Sequelize.STRING
    },
    Intermediate: {
        type: Sequelize.STRING
    },
    Advanced: {
        type: Sequelize.STRING
    },
    MyLocation: {
        type: Sequelize.STRING
    },
    StudentHome: {
        type: Sequelize.STRING
    },
    experience: {
        type: Sequelize.STRING
    },
    FromDate: {
        type: Sequelize.INTEGER
    },
    ToDate: {
        type: Sequelize.INTEGER
    },
    education: {
        type: Sequelize.STRING
    },
    FromDate2: {
        type: Sequelize.INTEGER
    },
    tODate2: {
        type: Sequelize.INTEGER
    },
    award: {
        type: Sequelize.STRING
    },
    Date: {
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
});

// force: true will drop the table if it already exists
profileSetting.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("profileSetting table synced")
});

module.exports = sequelize.model('profileSetting', profileSetting);