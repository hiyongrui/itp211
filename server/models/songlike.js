// models/songs.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Songlike = sequelize.define('Songlike', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    song_id: {
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
Songlike.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("song like table synced")
});

module.exports = sequelize.model('Songlike', Songlike);