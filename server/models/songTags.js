var myDatabase = require('../controllers/database');
var sequelizeInstance = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const SongTag = sequelizeInstance.define('SongTag', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    song_id: {
        type: Sequelize.INTEGER
    },
    songTags: {
        type: Sequelize.STRING,
        trim:true
    },
    user_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
})

SongTag.sync({ force: false, logging: console.log }).then(() => {
    console.log("SongTag tag table synced");
    SongTag.upsert({
        id: 1,
        song_id: 1,
        songTags: "calm",
        user_id: 2
    });
    SongTag.upsert({
        id: 2,
        song_id: 1,
        songTags: "study music",
        user_id: 2
    });
    SongTag.upsert({
        id: 3,
        song_id: 2,
        songTags: "classical music",
        user_id: 2
    });
    SongTag.upsert({
        id: 4,
        song_id: 2,
        songTags: "jazz",
        user_id: 2
    });
    SongTag.upsert({
        id: 5,
        song_id: 3,
        songTags: "music for reading",
        user_id: 2
    });
    SongTag.upsert({
        id: 6,
        song_id: 3,
        songTags: "rap music",
        user_id: 2
    });
});

module.exports = sequelizeInstance.model('SongTag', SongTag);