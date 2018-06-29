// Import modules

var fs = require('fs');
var mime = require('mime');
var gravatar = require('gravatar');

// set image file types
var IMAGE_TYPES = ['image/jpeg' , 'image/jpg' , 'image/png'];

var Images = require('../models/images');
var myDatabase = require('./database');
var sequelize = myDatabase.sequelize;

var Songs = require('../models/songs');
// Show images gallery
exports.show = function (req, res) {

    sequelize.query('select i.id, i.title, i.imageName, u.email AS user_id from Images i join Users u on i.user_id = u.id ',
    { model : Images} ).then((images) => {
            res.render('images-gallery', {
            title: 'Images Gallery',
            images: images,
            gravatar: gravatar.url(images.user_id, { s: '80', r: 'x', d: 'retro' }, true)
        }); 
    }).catch((err) => {
            return res.status(400).send({
                message: err
        });
    });
}; 

/* 
Images.findAll({
    attributes: ['id','title','content','user_id'],
    include: { model : Comments}
}).then(function(images,comments) {
    res.render('images-gallery', {
        title:'Comments Page',
        images: images,
        comments: comments
    });

})  */



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
        var imageData = {
            title: req.body.title,
            imageName: req.file.originalname,
            user_id: req.user.id
        }
        //save to database
        Images.create(imageData).then((newImage, created) => { //.then give you two object , new image and created
            if (!newImage) {
                return res.send(400, {
                    message: "error"
                });
            }
            res.redirect('images-gallery'); // or /images-gallery or {..}
        })

        // remove from temp folder
        fs.unlink(tempPath, function (err) {
            if (err) {
                return res.status(500).send('Something bad happened here');
            }
            // Redirect to gallery's page
            //res.redirect('images-gallery');
        });
    });
};

// Images authorisation middleware
exports.hasAuthorization = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};