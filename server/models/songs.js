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
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        trim: true
    },
    songListingType: {
        type: Sequelize.STRING
    },
    songName: {
        type: Sequelize.STRING
    },
    songImage: {
        type: Sequelize.STRING
    },
    songLikeNo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    songTags: {
        type: Sequelize.STRING,
        trim:true
    }
});

// force: true will drop the table if it already exists
Songs.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("songs table synced")
    Songs.upsert({
        id: 1,
        title: 'First song broken realit',
        songListingType: "Classical",
        songName: 'Broken Reality.mp3',
        songImage: "1.jpg",
        user_id: 2,
        songTags: "calm,study music"
    });
    Songs.upsert({
        id: 2,
        title: "second song exit premise",
        songListingType: "Jazz",
        songName: "Exit the Premises.mp3",
        songImage: "2.jpg",
        user_id: 2,
        songTags: "classical music,jazz"
    });
    Songs.upsert({
        id: 3,
        title: "third song imagine dragonss",
        songListingType: "Kpop",
        songName: "Imagine Dragons - Demons (Official).mp3",
        songImage: "3.jpg",
        user_id: 2,
        songTags: "music for reading, rap music"
    });
});

module.exports = sequelize.model('Songs', Songs);