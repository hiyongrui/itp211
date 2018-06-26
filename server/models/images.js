// models/images.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Images = sequelize.define('Images', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true // id is primary key
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
    user_id:{  // foreign key
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

// force: true will drop the table if it already exists
Images.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("images table synced");
});

module.exports = sequelize.model('Images', Images);
