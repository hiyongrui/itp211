// models/videos.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const Videos = sequelize.define('Videos', {
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
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:"$",
    },
    days: {
        type: Sequelize.STRING,
    },
    FromTime: {
        type: Sequelize.STRING,
    },
    ToTime: {
        type: Sequelize.STRING,
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
Videos.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("videos table synced")
    Videos.upsert({
        id: 1,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Apologize - Timbaland ft. One Republic - Fingerstyle Guitar CoverTrimTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 2,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Believer - Imagine Dragons - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 3,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Clean Bandit - Symphony feat. Zara Larsson - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 4,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Dennis Lloyd - Nevermind - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 5,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Despacito - Luis Fonsi ft. Justin Bieber & Daddy Yankee - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 6,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "John Legend - All of Me - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 7,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Marshmello & Anne-Marie - FRIENDS - Fingerstyle Guitar Cover OFFICIAL FRIENDZONE ANTHEMTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 8,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "My Heart Will Go On - Titanic Theme - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 9,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "New Rules - Dua Lipa - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 10,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Passenger - Let Her Go - Fingerstyle Guitar Cover By James BartholomewTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 11,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Perfect - Ed Sheeran - Fingerstyle Guitar CoverTrimTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 12,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Photograph - Ed Sheeran - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 13,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Pirates of the Caribbean Theme - Fingerstyle Guitar Cover.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 14,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Post Malone - Otherside - Fingerstyle Guitar CoverTrimTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 15,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Post Malone feat. 21 Savage - Rockstar - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 16,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Shape of You - Ed Sheeran - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 17,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "Something Just Like This - The Chainsmokers & Coldplay - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 18,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "XXXTENTACION - Hope - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 19,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "XXXTENTACION - Jocelyn Flores - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
    Videos.upsert({
        id: 20,
        created: '2018-08-05 23:12:25',
        title: "Guitar",
        category: "Guitar",
        videoName: "ZAYN - Dusk Till Dawn ft. Sia - Fingerstyle Guitar CoverTrim.mp4",
        price: 10,
        days: 'Monday',
        FromTime: '09AM',
        ToTime: '10AM',
        user_id: 2
    });
});

module.exports = sequelize.model('Videos', Videos);