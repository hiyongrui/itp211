// models/profileSetting.js
var myDatabase = require('../controllers/database');
var sequelize = myDatabase.sequelize;
var Sequelize = myDatabase.Sequelize;

const profileSetting = sequelize.define('profileSetting', {
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
        type: Sequelize.STRING
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
profileSetting.sync({ force: false, logging: console.log }).then(() => {
    // Table created
    console.log("profileSetting table synced");
    //upsert one profile setting so that kamali view lesson can work wtf why am i the one upserting
    profileSetting.upsert({
        lessons: "Guitar",
        message: "about guitar",
        Beginner: "Beginner",
        MyLocation: "Instructor's Location",
        location: "yishun",
        experience: "experience",
        FromDate: "12/2004",
        ToDate: "12/2008",
        education: "university",
        FromDate2: "12/2002",
        ToDate2: "12/2004",
        award: "jesus award",
        Date: "08/2018",
        user_id: 2
    });
});

module.exports = sequelize.model('profileSetting', profileSetting);