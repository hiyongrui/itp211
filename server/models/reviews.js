// models/reviews.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

var IMAGE_TYPES = ['image/jpeg' , 'image/jpg' , 'image/png'];

var Images = require('../models/images');

const Reviews = sequelize.define('Reviews', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    product_id: {
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    content: {
        type: Sequelize.STRING,
        defaultValue: '',
        trim: true
    },
    rating: {
        type: Sequelize.DECIMAL(10,2)
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
});

// force: true will drop the table if it already exists
Reviews.sync({ force: false, logging: console.log}).then(() => {
    // Table created
    console.log("reviews table synced");
});

module.exports = sequelize.model('Reviews', Reviews);