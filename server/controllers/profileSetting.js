// Import modules
var fs = require('fs');
var mime = require('mime');

// get gravatar icon from email
var gravatar = require('gravatar');

// set video file types
var VIDEO_TYPES = ['video/mp4' , 'video/webm' , 'video/ogg' , 'video/ogv'];

// get video model

var Timing = require('../models/timings');
var profileSetting = require('../models/profileSetting');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


//Add a new  student record to database
exports.insert = function(req,res) {
    var profileSettingData = {
        title: req.body.title,
        user_id: req.user.id,
        lessons: req.body.lessons,
        message: req.body.message,
        Beginner: req.body.Beginner,
        Intermediate: req.body.Intermediate,
        Advanced: req.body.Advanced,
        MyLocation: req.body.MyLocation,
        location: req.body.location,
        StudentHome: req.body.StudentHome,
        experience: req.body.experience,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        education: req.body.education,
        FromDate2: req.body.FromDate2,
        ToDate2: req.body.ToDate2,
        award: req.body.award,
        Date: req.body.Date,
        FromTime: req.body.FromTime,
        ToTime: req.body.ToTime,
        price: req.body.price,
        days: req.body.days,
    }

    profileSetting.create(profileSettingData).then((newRecord, created) => {
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
            attributes: ['id','title','lessons','message', 'Beginner', 'location', 'Intermediate', 'Advanced', 'MyLocation', 'StudentHome', 'experience', 'FromDate', 'ToDate', 'education', 'FromDate2', 'ToDate2', 'award', 'Date', 'days', 'price', 'FromTime', 'ToTime']
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
    profileSetting.findById(record_num).then(function (profileSettingRecord) {
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

    profileSetting.update(updateData, { where: { id: record_num } }).then((updatedRecord) => {
        if (!updatedRecord || updatedRecord == 0) {
            return res.send(400, {
                message: "error"
            });
        }
        res.status(200).send({ message: "Updated profile Setting:" + record_num});
    })
}

// List videos
exports.show = function (req,res) {
    sequelize.query('select ps.id , ps.title , ps.videoName , ps.price, ps.days, ps.FromTime, ps.ToTime, u.email AS user_id from ProfileSettings pf join Users u on pf.user_id = u.id' , 
        { model : profileSetting}).then((profilesettings) => {
        res.render('ProfileSettings' , {
            title:'Profile Settings Page',
            profilesettings : profilesettings,
            gravatar: gravatar.url(profilesettings.user_id, { s: '80', r:'x' , d:'retro'},true),
            urlPath: req.protocol + "://" + req.get("host")+ req.url
        });

    }).catch((err) => {
            return res.status(400).send({
                message: err
        });
    });
};

// Create videos
exports.uploadVideo = function (req,res) {
    var num = parseInt(req.body.counter);
    for (i=0; i<num;i++){
    var src;
    var dest;
    var targetPath;
    var targetName;
    console.log(req);
    var tempPath = req.file.path;

    // get the mime type of file
    var type = mime.lookup(req.file.mimetype);

    // get file extension
    var extension = req.file.path.split(/[. ]+/).pop();

    // check support file types
    if (VIDEO_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported video formats: mp4 , webm , ogg , ogv');
    }

    // Set new path to images
    targetPath = './public/videos/' + req.file.originalname;

    // using read stream API to read file
    src = fs.createReadStream(tempPath);

    // using write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);

    //Show error
    src.on('error' , function(error) {
        if (error) {
            return res.status(500).send({
                message: error
            });
        }
    });
    
    // Save file process
    
    src.on('end', function () {
            // Create a new instance of the Video model with request body
            var videoData = {
                title: req.body.title,
                videoName: req.file.originalname,
                price: req.body.price,
                days: req.body.days,
                FromTime: req.body.FromTime,
                ToTime: req.body.ToTime,
                user_id: req.user.id
            }

            // Save to database
            profileSetting.create(videoData).then((newVideo,created) => {
                if (!newVideo) {
                    return res.send(400, {
                        message: "error"
                    });
                };
                res.redirect('profileSetting');
            })

            // remove from temp folder
            fs.unlink(tempPath , function (err) {
                if (err) {
                    return res.status(500).send({
                        message: error
                    });
                }

                // Redirect to gallery's page
                //res.redirect('profileSetting');

            });
        });
    }
};

exports.delete = function (req,res) {
    var record_num = req.params.profilesettings_id;

    console.log("deleting videos" + record_num);
    profileSetting.destroy({where: { id: record_num } }).then( (deletedVid ) => {
        if(!deletedVid) {
            return res.send(400, {
                message: "error"
            });
        }
        
        res.status(200).send({message: "Deleted videos : " + record_num});
    })
}

exports.addTiming = function (req, res) {
    var user_id = req.user.id;
    var fromTime = req.body.fromTime;
    var toTime = req.body.toTime;
    console.log("Timing Length: " +fromTime.length)
    for (i = 0; i < fromTime.length; i++) {
        var tempFromTime = fromTime[i]; 
        console.log("tempFromTime: " +tempFromTime);
        var timingsData = {
            day: req.body.day,
            fromTime: tempFromTime,
            user_id: user_id
        }
        Timing.create(timingsData).then((newRecord, created) => {
            if (!newRecord) {
                return res.send(400, {
                    message : "error"
                });
            }
            res.redirect('/profileSetting');
        })
    }
    console.log("Timing Length: " +toTime.length)
    for (i = 0; i < toTime.length; i++) {
        var tempToTime = toTime[i]; 
        console.log("tempToTime: " +tempToTime);
        var timingsData = {
            day: req.body.day,
            fromTime: tempFromTime,
            toTime: tempToTime,
            user_id: user_id
        }
        Timing.create(timingsData).then((newRecord, created) => {
            if (!newRecord) {
                return res.send(400, {
                    message : "error"
                });
            }
            res.redirect('/profileSetting');
        })
    }

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