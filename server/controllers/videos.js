// Import modules
var fs = require('fs');
var mime = require('mime');

// get gravatar icon from email
var gravatar = require('gravatar');

// set video file types
var VIDEO_TYPES = ['video/mp4' , 'video/webm' , 'video/ogg' , 'video/ogv'];

// get video model
var Videos = require('../models/videos');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


// List videos
exports.show = function (req,res) {
    sequelize.query('select v.id , v.title , v.videoName , u.email AS user_id from Videos v join Users u on v.user_id = u.id' , 
        { model : Videos}).then((videos) => {

        res.render('videos' , {
            title:'Videos Page',
            videos: videos,
            gravatar: gravatar.url(videos.user_id, { s: '80', r:'x' , d:'retro'},true),
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
            user_id: req.user.id

        }

        // Save to database
        Videos.create(videoData).then((newVideo,created) => {
            if (!newVideo) {
                return res.send(400, {
                    message: "error"
                });
            };
            res.redirect('videos');
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
};

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
 // Videos authorization middleware
 exports.hasAuthorization = function (req, res, next) {
     if (req.isAuthenticated())
         return next();
     res.redirect('/login');
 }




