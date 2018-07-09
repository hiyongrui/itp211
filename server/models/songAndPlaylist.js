// models/songs.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const SongsAndPlaylist = sequelize.define('SongsAndPlaylist', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    playlist_id: {
        type: Sequelize.INTEGER
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
SongsAndPlaylist.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("songs table synced");
});

module.exports = sequelize.model('SongsAndPlaylist', SongsAndPlaylist);