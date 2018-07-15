
var profileSetting = require('../models/profileSetting');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


//Add a new  student record to database
exports.insert = function(req,res) {
    var profileSettingData = {
        title: req.body.title,
        user_id: req.user.id,
        lessons: req.body.lessons,
        message: req.body.message
    }

    profileSettingModel.create(profileSettingData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                message : "error"
            });
        }
        res.redirect('/profileSetting');
    })
};

    //list all the profile setting records in database
    exports.list = function(req,res) {
        profileSetting.findAll({
            attributes: ['id','title','lessons','message']
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

    //List one profile setting record from database
exports.editprofileSetting= function(req,res) {
    var record_num = req.params.id;
    profileSettingModel.findById(record_num).then(function (profileSettingRecord) {
        res.render('editprofileSetting', {
            title: "profileSetting!",
            item: profileSettingRecord,
            hostPath: req.protocol + "://" + req.get("host")
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};


//  Update profileSetting record in database
exports.update = function (req,res) {
    var record_num = req.params.id;
    var updateData = {
        title: req.body.title,
        user_id: req.user.id,
        lessons: req.body.lessons,
        message: req.body.message
    }

    profileSettingModel.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated profile Setting:" + record_num});
    })
}

// Show home screen
exports.show = function(req, res) {
	// Render home screen
	res.render('viewAllLessons', {
		title: 'Lessons',
	});
};


// profileSetting authorization middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};