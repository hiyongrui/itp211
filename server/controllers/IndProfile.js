
var IndProfile = require('../models/IndProfile');
var profileSetting = require('../models/profileSetting');
var user = require('../models/users');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


// List IndProfile
exports.show = function (req, res) {
    var user_id = req.params.id;
    console.log("user id indivi profile sett    " + user_id);
    sequelize.query('SELECT * FROM profilesettings ps inner JOIN users u ON u.id = ps.user_id', {type: sequelize.QueryTypes.SELECT}).then(function (data) {
        console.log("**********************",data)
        res.render('IndProfile', {
            title: "Practical 5 Database Node JS - Edit Student Record",
            itemList: data,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
    }
//list all the profile setting records in database
exports.list = function(req,res) {
    profileSetting.findAll({
        attributes: ['id','title','lessons','message', 'Beginner', 'location', 'Intermediate', 'Advanced', 'MyLocation', 'StudentHome', 'experience', 'FromDate', 'ToDate', 'education', 'FromDate2', 'ToDate2', 'award', 'Date']
    }).then(function (profileSetting) {
        res.render('profileSetting', {
            title: "profileSetting",
            profileSetting: profileSetting,
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

// IndProfile authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};