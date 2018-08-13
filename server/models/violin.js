// models/violin.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const violin = sequelize.define('violin', {
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
    location: {
        type: Sequelize.STRING
    },
    StudentHome: {
        type: Sequelize.STRING
    },
    experience: {
        type: Sequelize.STRING
    },
    FromDate: {
        type: Sequelize.STRING
    },
    ToDate: {
        type: Sequelize.STRING
    },
    education: {
        type: Sequelize.STRING
    },
    FromDate2: {
        type: Sequelize.STRING
    },
    ToDate2: {
        type: Sequelize.STRING
    },
    award: {
        type: Sequelize.STRING
    },
    Date: {
        type: Sequelize.STRING
    },
});

// force: true will drop the table if it already exists
violin.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("violin table synced");
});

module.exports = sequelize.model('violin', violin);