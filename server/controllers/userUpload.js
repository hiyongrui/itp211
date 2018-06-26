// Import modules

var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');

// set image file types
var IMAGE_TYPES = ['image/jpeg' , 'image/jpg' , 'image/png'];

var Users = require('../models/users');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;


exports.role = function(req,res) {
    var user_id = req.user.id;
    var userRole = req.body.role;
   console.log("this is user_id > " + user_id);
   console.log("this is user selection of role > " + userRole);
    Users.findById(user_id).then(user => {
        user.role = userRole;
        user.save();
        res.redirect("/userUpload");
    })
}

Users.findById(1).then(admin => {
    admin.role = "admin";
    admin.save();
})


// Image upload
exports.uploadImage = function (req, res) {
    var src;    
    var dest;
    var targetPath;
    var targetName;
    var tempPath = req.file.path;
    console.log("SMLJ IS REQ FILE " + req.file);

    //get mime type of file
    var type = mime.lookup(req.file.mimetype);

    //get file extension
    var extension = req.file.path.split(/[. ]+/).pop();

    // check support file types
    if (IMAGE_TYPES.indexOf(type) == -1) {
        return res.status(415).send('Supported image formats: jpeg, jpg, jpe, png');
    }

    // set new path to images
    targetPath = './public/images/' + req.file.originalname;

    // using read stream API to read file;
    src = fs.createReadStream(tempPath);

    // using write stream API to write file
    dest = fs.createWriteStream(targetPath);
    src.pipe(dest);   //copy data from tempPath to targetPath aka ./public/images/ + name of file

    // Show error  , #listen for error event
    src.on('error', function (err) {
        if (err) {
            return res.status(500).send({
                message: error
            });     
        }
    });

    // save file process   , #listen for stream completion event
    src.on('end',function () {
        //create a new instance of the Images model with request body
        
         var userImage = req.file.originalname
            //user_id: req.user.id
        
        var user_id = req.user.id
        //save to database
        Users.findById(user_id).then(user => {
            user.userImage = userImage;
            user.save();
            res.redirect('/profile');
        })

    })
         

        // remove from temp folder
        fs.unlink(tempPath, function (err) {
            if (err) {
                return res.status(500).send('Something bad happened here');
            }
            // Redirect to gallery's page
            //res.redirect('images-gallery');
        });
    };



// Images authorisation middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};