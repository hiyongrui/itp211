// models/playlists.js

var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Playlists = sequelize.define('Playlists', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    /* playlist_id: {
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    }, */
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
    /*
    song_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        defaultValue: 1, // once i put reference to song , i cant delete first song cos its foreign key.
        primaryKey: true, //composite key with playlist_id? 
        references: {
            model: 'Songs',
            key: 'id'
    }, */
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
Playlists.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("playlists table synced")
});

module.exports = sequelize.model('Playlists', Playlists);