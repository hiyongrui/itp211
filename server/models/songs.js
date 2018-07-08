// models/songs.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Songs = sequelize.define('Songs', {
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
    songName: {
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
Songs.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("songs table synced")
    return Songs.upsert({
        id: 1,
        title: 'First song synced',
        songName: 'Broken Reality.mp3',
        user_id: 1
        //experience: 10
    })
});

module.exports = sequelize.model('Songs', Songs);