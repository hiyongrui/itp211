
// Import modules
var fs = require('fs');
var mime = require('mime');

// get gravatar icon from email
var gravatar = require('gravatar');

// set video file types
var VIDEO_TYPES = ['video/mp4' , 'video/webm' , 'video/ogg' , 'video/ogv'];

var bookingHistory = require('../models/bookingHistory');
var bookingDetails = require('../models/bookingDetails');
var Users = require('../models/users');
var Videos = require('../models/videos');
var Timing = require('../models/timings');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

exports.timingTest = function(req, res) {
    sequelize.query('select v.id , v.title , v.videoName , v.price, v.days, v.FromTime, v.ToTime, u.name AS user_id from Videos v join Users u on v.user_id = u.id' , 
        { model : Videos}).then((videos) => {
        res.render('tempTiming' , {
            title:'wot is tis',
            videos: videos,
            gravatar: gravatar.url(videos.user_id, { s: '80', r:'x' , d:'retro'},true),
            urlPath: req.protocol + "://" + req.get("host")+ req.url,
            hostPath: req.protocol + "://" + req.get("host")
        });

    }).catch((err) => {
            return res.status(400).send({
                message: err
        });
    });
};

exports.addTiming = function (req, res) {
    var user_id = req.user.id;
    var fromTime = req.body.fromTime
    var toTime = req.body.toTime
    console.log("Timing Length: " +fromTime.length)
    for (i = 0; i < fromTime.length; i++) {
        var fromTimeAmt = parseInt(fromTime[i]);
        console.log("From Time: " +fromTimeAmt);
        var toTimeAmt = parseInt(toTime[i]);
        console.log("To Time:" +toTimeAmt);
        while (fromTimeAmt < toTimeAmt) {
            var tempFromTime = fromTimeAmt;
            var tempToTime = tempFromTime + 1; 
            var timingsData = {
                day: req.body.day,
                fromTime: tempFromTime,
                toTime: tempToTime,
                user_id: user_id
            }
            fromTimeAmt += 1;
            Timing.create(timingsData).then((newRecord, created) => {
                if (!newRecord) {
                    return res.send(400, {
                        message : "error"
                    });
                }
            })
        }
        
    }
    res.redirect('/videos');

};

exports.bookingForm = function(req, res) {
    var lesson_id = req.params.id;
    sequelize.query('select v.id , user_id, v.title , u.name AS username , v.price from Videos v join Users u on user_id = u.id where v.id = '+lesson_id, 
        { model : Videos}).then((lessonData) => {
            console.log(lessonData);
            console.log("lesson name: " +lessonData[0].title);
            console.log("user name: " +lessonData[0].username);
            console.log(lessonData[0].user_id);
        res.render('bookingForm', {
            title: "Book Appointment",
            lessonData: lessonData,
            hostPath: req.protocol + "://" + req.get("host"),
            urlPath: req.protocol + "://" + req.get("host") + req.url
        });
    }).catch((err) => {
        return res.status(400).send({
            message: err
        });
    });
};

exports.getTimings = function(req, res) {
    var lesson_id = req.params.id;
    user_id = req.user.id;
    var day = req.body.day;
    console.log("day: " +day);
    sequelize.query("SELECT fromTime, toTime, isBooked FROM timings WHERE lesson_id ='" +lesson_id+"' and day = '" +day+ "'", { type: sequelize.QueryTypes.SELECT})
    .then(data => {
        res.send(data);
    });
};

exports.bookingPayment = function (req, res) {
    var user_id = req.user.id;
    var totalPrice = req.body.totalPrice;
    sequelize.query('SELECT coin FROM users WHERE id="'+req.user.id+'"', { type: sequelize.QueryTypes.SELECT })
    .then(userBalance => {
        var currBalance = userBalance[0].coin;
        currBalance = currBalance;
        currBalance = parseInt(currBalance);
        newUserBalance = currBalance - totalPrice;
        newUserBalance = parseInt(newUserBalance);
        console.log("user balance new: " +newUserBalance);
        var paymentData = {
            coin: newUserBalance
        }
        Users.update(paymentData, { where: { id: user_id } }).then((updatedRecord) => {
            if (!updatedRecord) {
                return res.send(400, {
                     message: "error"
                });
            }
            res.redirect('/bookingForm/'+req.params.id);
        });
    })

};

exports.sendPayment = function(req, res) {
    var totalPrice = req.body.totalPrice;
    var instructor_id = req.body.instructor_id;
    sequelize.query('SELECT coin balance FROM users where id="'+instructor_id+'"', { type: sequelize.QueryTypes.SELECT })
    .then(userBalance => {
        var currBalance = userBalance[0].balance;
        newBalance = currBalance + totalPrice;
        console.log("instructor new balance: " +newBalance);
        var newInstructorBalance = {
            coin: newBalance
        }
        Users.update(newInstructorBalance, { where: { id: instructor_id } }).then((updatedRecord) => {
            if (!updatedRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('/bookingForm/' +req.params.id);
        });
    });
};

exports.createBooking = function(req, res) {
    user_id = req.user.id;
    totalPrice = req.body.totalPrice;
    instructor_id = req.body.instructor_id
    lesson_name = req.body.lesson_name
    var dateToday = new Date()
    var purchaseDate = dateToday.getFullYear()+'/'+(dateToday.getMonth()+1)+'/'+dateToday.getDate();
    var createBookingData = {
        instructor_id: instructor_id,
        user_id: user_id,
        totalPrice: totalPrice,
        purchaseDate: purchaseDate,
        lesson_name: lesson_name
    }
    bookingHistory.create(createBookingData).then((newRecord, created) => {
        if (!newRecord) {
            return res.send(400, {
                messsage: "error"
            });
        };
        res.redirect('/bookingForm/'+req.params.id);
    });
};

exports.booking = function(req, res) {
    lesson_id = req.params.id;
    user_id = req.user.id;
    day_id = req.body.dayValue;
    day = req.body.days;
    timings = req.body.timings;
    console.log("lesson id: " +lesson_id);
    for (var i = 0; i < timings.length; i++) {
        var tempTime = timings[i];
        tempTime = tempTime.trim();
        var tempDay = day[i];
        tempDay = tempDay.trim();
        console.log("timings: " +tempTime[i]);
        console.log("day: " +tempDay);
        var isBooked = {
            isBooked: true
        }
        Timing.update(isBooked, { where: { lesson_id: lesson_id, day: tempDay, fromTime: tempTime } }).then((updatedRecord) => {
            if (!updatedRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
        });
    };
    sequelize.query("SELECT max(id) current_id FROM bookinghistories WHERE user_id = '"+user_id+"'", { type: sequelize.QueryTypes.SELECT})
    .then(data => {
        var curr_id = data[0].current_id;
        console.log("booking current id: " +curr_id);
        for (var i = 0; i < timings.length; i++) {
            var dateNow = new Date();
            var dayNow = dateNow.getDay();
            console.log("day id " +day_id[i]);
            if (day_id[i] >= dayNow) {
                addDay = day_id[i] - dayNow;
                var newDate = new Date();
                newDate.setDate(dateNow.getDate() + addDay);
                var bookDate = newDate.getFullYear()+'/'+(newDate.getMonth()+1)+'/'+newDate.getDate();
                console.log("bookDate: " +bookDate);
            }
            var bookingDetailsData = {
                day: day[i],
                bookingDate: bookDate,
                timing: timings[i],
                booked_id: curr_id,
                user_id: user_id
            }
            bookingDetails.create(bookingDetailsData).then((newRecord, created) => {
                if (!newRecord) {
                    return res.send(400, {
                        message: "error"
                    });
                }
            });
        };
        res.redirect('/bookingForm/'+req.params.id);
    })
};

exports.uploadVideo = function (req,res, next) {
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
            Videos.create(videoData).then((newVideo,created) => {
                if (!newVideo) {
                    return res.send(400, {
                        message: "error"
                    });
                };
                next()
            })

            // remove from temp folder
            fs.unlink(tempPath , function (err) {
                if (err) {
                    return res.status(500).send({
                        message: error
                    });
                }

                // Redirect to gallery's page
                //res.redirect('videos');

            });
        });
    }
};

exports.appendId = function (req, res) {
    user_id = req.user.id;
    sequelize.query("SELECT max(id) currId FROM videos where user_id = '" +user_id+ "'", { type : sequelize.QueryTypes.SELECT})
    .then(data => {
        var currId = data[0].currId;
        console.log(currId);
        var appendId = {
            lesson_id: currId
        }
        Timing.update(appendId, { where: { lesson_id : null, user_id : user_id } }).then((updatedRecord) => {
            if (!updatedRecord) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.status(200).send({ message: "Updated lesson_id" });

        });
    
    })
}

exports.delete = function (req,res) {
    var record_num = req.params.videos_id;

    console.log("deleting videos" + record_num);
    Videos.destroy({where: { id: record_num } }).then( (deletedVid ) => {
        if(!deletedVid) {
            return res.send(400, {
                message: "error"
            });
        }
        
        res.status(200).send({message: "Deleted videos : " + record_num});
    })
}

// exports.listUserBookingHistory = function(req, res) {
//     var user_id = req.user.id;
//     sequelize.query('SELECT * FROM ')
// };

exports.listBookingHistory = function(req, res) {
    res.render('bookingHistory', {
        title: "Booking History",
        hostPath: req.protocol + "://" + req.get("host") + req.url,
        urlPath: req.protocol + "://" + req.get("host")
    });
}

exports.listUserHistory = function(req, res) {
    var user_id = req.user.id;
    sequelize.query('SELECT b.id, b.totalPrice, b.instructor_id, b.lesson_name, b.purchaseDate, u.email FROM bookinghistories b JOIN users u ON b.instructor_id = u.id WHERE b.user_id = "'+user_id+'"', { type: sequelize.QueryTypes.SELECT },
    { model : bookingHistory}).then((data) => {
        console.log(data);
        console.log(data.length);
        console.log("instructor email: " +data[0].email);
        console.log(data[0].id);
        res.send(data);
    })
}

exports.listInstructorHistory = function(req, res) {
    var user_id = req.user.id;
    sequelize.query('SELECT b.id, b.totalPrice, b.user_id, b.lesson_name, b.purchaseDate, u.email FROM bookinghistories b JOIN users u ON b.user_id = u.id WHERE b.instructor_id = "'+user_id+'"', { type: sequelize.QueryTypes.SELECT },
    { model : bookingHistory}).then((data) => {
        console.log(data);
        console.log(data.length);
        console.log("instructor email: " +data[0].email);
        console.log(data[0].id);
        res.send(data);
    })
}

exports.getDetails = function(req, res) {
    var row_id = req.body.row_id;
    sequelize.query('SELECT * FROM bookingdetails WHERE booked_id = "'+row_id+'"', { type: sequelize.QueryTypes.SELECT})
    .then(data => {
        console.log("data getDetails length: " +data.length);
        console.log(data[0].day);
        res.send(data);
    })
}